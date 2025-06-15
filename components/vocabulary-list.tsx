"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  VolumeIcon as VolumeUp,
  BookOpen,
  Check,
  X,
  MapPin,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ArrowLeft,
  Loader2,
  ChevronsUpDown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  getLocationsReferencingVocabulary,
  getPhrasesReferencingVocabulary,
  getRandomSample,
  getVocabularyByLocation,
  type Phrase,
} from "@/lib/data-utils"

interface VocabularyListProps {
  selectedCategories: string[]
  words: {
    id: string
    jp: string
    kr: string
    romaji?: string
    example?: string
    exampleKr?: string
    category: string
    tags: string[]
    relatedPhraseIds: string[]
  }[]
  availableCategories: string[]
  locationFilter?: string // 특정 장소 ID로 필터링
}

export default function VocabularyList({
  selectedCategories,
  words,
  availableCategories,
  locationFilter,
}: VocabularyListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [showingTranslation, setShowingTranslation] = useState<number[]>([])
  const [savedWords, setSavedWords] = useState<number[]>([])
  const [quizMode, setQuizMode] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<number | null>(null)
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null)
  const [expandedDetails, setExpandedDetails] = useState<number[]>([])
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 })
  const [quizProgress, setQuizProgress] = useState(0)
  const [quizWords, setQuizWords] = useState<typeof words>([])
  const [quizOptions, setQuizOptions] = useState<string[][]>([])
  const [filteredWords, setFilteredWords] = useState<typeof words>([])
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  // 관련 장소와 회화를 저장할 상태 추가
  const [relatedData, setRelatedData] = useState<{
    [key: string]: { locations: { id: string; name: string; region: string }[]; phrases: Phrase[] }
  }>({})
  const [loadingRelated, setLoadingRelated] = useState<{ [key: string]: boolean }>({})

  // 카테고리 토글 함수
  const toggleCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    let newCategories = [...selectedCategories]

    if (newCategories.includes(category)) {
      newCategories = newCategories.filter((c) => c !== category)
    } else {
      newCategories.push(category)
    }

    if (newCategories.length > 0) {
      params.set("categories", newCategories.join(","))
    } else {
      params.delete("categories")
    }

    router.push(`/vocabulary?${params.toString()}`)
  }

  // 모든 카테고리 선택/해제
  const clearAllCategories = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("categories")
    router.push(`/vocabulary?${params.toString()}`)
  }

  // 장소 필터링 및 카테고리 필터링 적용
  useEffect(() => {
    const applyFilters = async () => {
      setIsLoading(true)
      try {
        let wordsToFilter = words

        // 장소 필터링 먼저 적용
        if (locationFilter) {
          const locationWords = await getVocabularyByLocation(locationFilter)
          wordsToFilter = locationWords
        }

        // 카테고리 필터링 적용 (선택된 카테고리가 없으면 모든 단어 표시)
        const filtered =
          selectedCategories.length === 0
            ? wordsToFilter
            : wordsToFilter.filter((word) => selectedCategories.includes(word.category))

        setFilteredWords(filtered)
      } catch (error) {
        console.error("Failed to filter words:", error)
        setFilteredWords(words)
      } finally {
        setIsLoading(false)
      }
    }

    applyFilters()
  }, [locationFilter, words, selectedCategories])

  const toggleTranslation = (index: number) => {
    if (showingTranslation.includes(index)) {
      setShowingTranslation(showingTranslation.filter((i) => i !== index))
    } else {
      setShowingTranslation([...showingTranslation, index])
    }
  }

  const toggleSaved = (index: number) => {
    if (savedWords.includes(index)) {
      setSavedWords(savedWords.filter((i) => i !== index))
    } else {
      setSavedWords([...savedWords, index])
    }
  }

  const toggleDetails = async (index: number, word: (typeof words)[0]) => {
    if (expandedDetails.includes(index)) {
      setExpandedDetails(expandedDetails.filter((i) => i !== index))
    } else {
      setExpandedDetails([...expandedDetails, index])

      // 세부 정보가 확장될 때 관련 데이터 로드
      if (!relatedData[word.id] && !loadingRelated[word.id]) {
        setLoadingRelated((prev) => ({ ...prev, [word.id]: true }))

        try {
          // 비동기로 관련 장소와 회화 데이터 로드
          const [locations, phrases] = await Promise.all([
            getLocationsReferencingVocabulary(word.id),
            getPhrasesReferencingVocabulary(word.id),
          ])

          // 랜덤으로 5개까지만 선택
          const randomLocations = getRandomSample(locations, 5)
          const randomPhrases = getRandomSample(phrases, 5)

          setRelatedData((prev) => ({
            ...prev,
            [word.id]: {
              locations: randomLocations,
              phrases: randomPhrases,
            },
          }))
        } catch (error) {
          console.error("Failed to load related data:", error)
        } finally {
          setLoadingRelated((prev) => ({ ...prev, [word.id]: false }))
        }
      }
    }
  }

  // 퀴즈 모드 시작
  const startQuiz = () => {
    // 필터링된 단어가 없으면 퀴즈 시작 불가
    if (filteredWords.length === 0) return

    // 퀴즈에 사용할 단어 목록 준비 (최대 10개)
    const shuffledWords = [...filteredWords].sort(() => 0.5 - Math.random())
    const selectedWords = shuffledWords.slice(0, Math.min(10, shuffledWords.length))

    // 모든 문제에 대한 옵션을 미리 생성
    const allOptions = selectedWords.map((currentWord) => {
      // 퀴즈 옵션 생성 (현재 단어 + 랜덤 3개)
      // 필터링된 단어가 4개 미만이면 전체 단어 목록에서 가져옴
      const optionPool = filteredWords.length >= 4 ? filteredWords : words

      return [
        currentWord.kr,
        ...optionPool
          .filter((w) => w.kr !== currentWord.kr)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((w) => w.kr),
      ].sort(() => 0.5 - Math.random())
    })

    setQuizWords(selectedWords)
    setQuizOptions(allOptions)
    setQuizMode(true)
    setCurrentQuiz(0) // 첫 번째 문제부터 시작
    setQuizAnswer(null)
    setQuizScore({ correct: 0, total: 0 })
    setQuizProgress(0)
  }

  // 퀴즈 답변 체크
  const checkAnswer = (answer: string) => {
    if (currentQuiz === null || quizAnswer !== null) return

    const currentWord = quizWords[currentQuiz]
    const isCorrect = answer === currentWord.kr

    setQuizAnswer(answer)
    setQuizScore((prev) => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }))

    // 다음 퀴즈 준비
    setTimeout(() => {
      if (currentQuiz < quizWords.length - 1) {
        // 현재 스크롤 위치 저장
        const scrollPosition = window.scrollY

        setCurrentQuiz(currentQuiz + 1)
        setQuizAnswer(null)
        setQuizProgress(((currentQuiz + 1) / quizWords.length) * 100)

        // 스크롤 위치 복원
        setTimeout(() => {
          window.scrollTo(0, scrollPosition)
        }, 0)
      } else {
        // 모든 퀴즈 완료
        setQuizProgress(100)
      }
    }, 1500)
  }

  // 퀴즈 종료
  const endQuiz = () => {
    setQuizMode(false)
    setCurrentQuiz(null)
    setQuizAnswer(null)
    setQuizProgress(0)
    setQuizWords([])
  }

  // 퀴즈 다시 시작
  const restartQuiz = () => {
    // 퀴즈에 사용할 단어 목록 다시 준비
    const shuffledWords = [...filteredWords].sort(() => 0.5 - Math.random())
    const selectedWords = shuffledWords.slice(0, Math.min(10, shuffledWords.length))

    // 모든 문제에 대한 옵션을 미리 생성
    const allOptions = selectedWords.map((currentWord) => {
      const optionPool = filteredWords.length >= 4 ? filteredWords : words

      return [
        currentWord.kr,
        ...optionPool
          .filter((w) => w.kr !== currentWord.kr)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((w) => w.kr),
      ].sort(() => 0.5 - Math.random())
    })

    setQuizWords(selectedWords)
    setQuizOptions(allOptions)
    setCurrentQuiz(0)
    setQuizAnswer(null)
    setQuizScore({ correct: 0, total: 0 })
    setQuizProgress(0)
  }

  // 퀴즈 모드 UI
  if (quizMode) {
    // 퀴즈 완료 화면
    if (quizProgress === 100) {
      return (
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">단어 퀴즈 결과</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={endQuiz}
              className="border-ocean-200 text-ocean-700 hover:bg-ocean-50 dark:border-ocean-900/50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> 단어장으로 돌아가기
            </Button>
          </div>

          <Card className="mb-6 border-ocean-200 dark:border-ocean-900/50">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-ocean-100 dark:bg-ocean-900/30 flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-ocean-600 dark:text-ocean-400">
                  {Math.round((quizScore.correct / quizScore.total) * 100)}%
                </span>
              </div>
              <p className="text-xl font-bold mb-2">
                {quizScore.correct}개 맞았습니다! ({quizScore.total}문제 중)
              </p>
              <p className="text-muted-foreground text-center mb-6">
                {quizScore.correct === quizScore.total
                  ? "완벽해요! 모든 문제를 맞혔습니다."
                  : quizScore.correct >= quizScore.total * 0.7
                    ? "잘했어요! 대부분의 단어를 알고 있네요."
                    : "좋은 시도였어요! 더 연습해보세요."}
              </p>
              <div className="flex gap-3">
                <Button onClick={restartQuiz} className="flex-1 flex items-center justify-center h-10">
                  <RefreshCw className="h-4 w-4 mr-1" /> 다시 도전하기
                </Button>
                <Button variant="outline" onClick={endQuiz} className="flex-1 flex items-center justify-center h-10">
                  단어장으로 돌아가기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    // 퀴즈 진행 중 화면
    if (currentQuiz !== null && quizWords.length > 0) {
      const currentWord = quizWords[currentQuiz]
      const options = quizOptions[currentQuiz]

      return (
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">단어 퀴즈</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={endQuiz}
              className="border-ocean-200 text-ocean-700 hover:bg-ocean-50 dark:border-ocean-900/50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
            >
              퀴즈 종료
            </Button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>진행도</span>
              <span>
                {currentQuiz + 1} / {quizWords.length}
              </span>
            </div>
            <Progress value={quizProgress} className="h-2" />
          </div>

          <Card className="mb-6 border-ocean-200 dark:border-ocean-900/50">
            <CardContent className="p-6 flex flex-col items-center">
              <p className="text-3xl font-bold mb-4">{currentWord.jp}</p>
              <Button
                variant="ghost"
                size="icon"
                className="text-ocean-500 hover:text-ocean-600 hover:bg-ocean-50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
              >
                <VolumeUp className="h-5 w-5" />
              </Button>
              {currentWord.example && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 italic">"{currentWord.example}"</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {options.map((option, idx) => (
              <Button
                key={idx}
                variant={quizAnswer === null ? "outline" : option === currentWord.kr ? "default" : "outline"}
                className={cn(
                  "h-20 py-4 relative flex items-center justify-center",
                  quizAnswer === null
                    ? "border-ocean-200 text-ocean-700 hover:bg-ocean-50 dark:border-ocean-900/50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
                    : option === currentWord.kr
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "",
                  quizAnswer !== null && option === quizAnswer && option !== currentWord.kr
                    ? "bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-900/50 dark:text-red-400"
                    : "",
                )}
                onClick={() => checkAnswer(option)}
                disabled={quizAnswer !== null}
              >
                <span>{option}</span>
                {quizAnswer !== null && option === currentWord.kr && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                {quizAnswer !== null && option === quizAnswer && option !== currentWord.kr && (
                  <div className="absolute top-2 right-2">
                    <X className="h-4 w-4 text-red-500" />
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>
      )
    }
  }

  // 일반 단어장 모드 UI
  return (
    <div>
      {/* 카테고리 필터 콤보박스 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">카테고리 필터</h3>
          {selectedCategories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllCategories}
              className="text-ocean-600 hover:text-ocean-700 hover:bg-ocean-50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
            >
              모두 해제
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {/* 콤보박스 */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between border-ocean-200 text-ocean-700 hover:bg-ocean-50 dark:border-ocean-900/50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
              >
                {selectedCategories.length === 0
                  ? "카테고리를 선택하세요..."
                  : `${selectedCategories.length}개 카테고리 선택됨`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="카테고리 검색..." />
                <CommandList>
                  <CommandEmpty>카테고리를 찾을 수 없습니다.</CommandEmpty>
                  <CommandGroup>
                    {availableCategories.map((category) => (
                      <CommandItem
                        key={category}
                        value={category}
                        onSelect={() => {
                          toggleCategory(category)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCategories.includes(category) ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {category}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* 선택된 카테고리 표시 */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="bg-ocean-100 text-ocean-700 hover:bg-ocean-200 dark:bg-ocean-900/30 dark:text-ocean-300 cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 로딩 중일 때 */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-ocean-500" />
        </div>
      )}

      {/* 단어 목록 */}
      {!isLoading && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {selectedCategories.length === 0
                ? `모든 단어 (${filteredWords.length}개)`
                : `${selectedCategories.join(", ")} 관련 단어 (${filteredWords.length}개)`}
              {locationFilter && " (장소 필터 적용됨)"}
            </h2>
            {filteredWords.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={startQuiz}
                className="border-ocean-200 text-ocean-700 hover:bg-ocean-50 dark:border-ocean-900/50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
              >
                퀴즈 모드
              </Button>
            )}
          </div>

          {filteredWords.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {selectedCategories.length === 0
                  ? "단어가 없습니다."
                  : locationFilter
                    ? "이 장소와 관련된 단어가 없습니다."
                    : "선택한 카테고리에 해당하는 단어가 없습니다."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWords.map((word, idx) => (
                <Card
                  key={idx}
                  className={cn(
                    "overflow-hidden card-hover border-gray-100 dark:border-gray-800",
                    savedWords.includes(idx) ? "border-ocean-300 dark:border-ocean-700" : "",
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-bold">{word.jp}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-ocean-500 hover:text-ocean-600 hover:bg-ocean-50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
                          >
                            <VolumeUp className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className={`mt-1 ${showingTranslation.includes(idx) ? "" : "blur-sm hover:blur-none"}`}>
                          {word.kr}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {word.category}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${
                          savedWords.includes(idx)
                            ? "text-ocean-500 hover:text-ocean-600 hover:bg-ocean-50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
                            : ""
                        }`}
                        onClick={() => toggleSaved(idx)}
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    </div>

                    {word.example && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-sm italic text-gray-600 dark:text-gray-400">{word.example}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-1 h-7 text-xs px-2 text-ocean-700 hover:text-ocean-800 hover:bg-ocean-50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
                          onClick={() => toggleTranslation(idx)}
                        >
                          {showingTranslation.includes(idx) ? "번역 숨기기" : "번역 보기"}
                        </Button>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between text-ocean-700 hover:text-ocean-800 hover:bg-ocean-50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
                        onClick={() => toggleDetails(idx, word)}
                      >
                        <span>관련 장소 및 회화 보기</span>
                        {expandedDetails.includes(idx) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>

                      {expandedDetails.includes(idx) && (
                        <div className="mt-3 space-y-4">
                          {/* 로딩 중 표시 */}
                          {loadingRelated[word.id] && (
                            <div className="flex justify-center py-4">
                              <Loader2 className="h-6 w-6 animate-spin text-ocean-500" />
                            </div>
                          )}

                          {/* 관련 장소 섹션 */}
                          {relatedData[word.id] && relatedData[word.id].locations.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-sakura-500" />
                                <span>이 단어가 사용되는 장소</span>
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {relatedData[word.id].locations.map((location, locIdx) => (
                                  <Link key={locIdx} href={`/local-picks/${location.id}`}>
                                    <Badge
                                      className="cursor-pointer bg-sakura-100 text-sakura-700 hover:bg-sakura-200 dark:bg-sakura-900/30 dark:text-sakura-300"
                                      variant="secondary"
                                    >
                                      {location.name} ({location.region})
                                    </Badge>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 관련 회화 섹션 */}
                          {relatedData[word.id] && relatedData[word.id].phrases.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                                <MessageSquare className="h-4 w-4 text-ocean-500" />
                                <span>이 단어가 사용되는 회화</span>
                              </h4>
                              <ul className="space-y-2">
                                {relatedData[word.id].phrases.map((phrase, phraseIdx) => (
                                  <li key={phraseIdx} className="flex items-center text-sm">
                                    <VolumeUp className="h-4 w-4 mr-2 text-ocean-500 flex-shrink-0" />
                                    <Link
                                      href={`/phrases?phrase=${phrase.id}`}
                                      className="text-gray-600 dark:text-gray-400 hover:text-ocean-600 dark:hover:text-ocean-400"
                                    >
                                      {phrase.jp}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* 관련 데이터가 없는 경우 */}
                          {relatedData[word.id] &&
                            relatedData[word.id].locations.length === 0 &&
                            relatedData[word.id].phrases.length === 0 && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 py-2">
                                이 단어와 관련된 장소나 회화가 없습니다.
                              </p>
                            )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
