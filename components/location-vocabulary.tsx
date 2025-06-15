"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VolumeIcon as VolumeUp, BookOpen, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { getLocationById, getRelatedVocabulary, type Location, type Vocabulary } from "@/lib/data-utils"

interface LocationVocabularyProps {
  locationId: string
}

export default function LocationVocabulary({ locationId }: LocationVocabularyProps) {
  const [location, setLocation] = useState<Location | null>(null)
  const [vocabularyCategories, setVocabularyCategories] = useState<{ category: string; words: Vocabulary[] }[]>([])
  const [loading, setLoading] = useState(true)
  const [savedWords, setSavedWords] = useState<string[]>([])
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function loadLocationVocabulary() {
      try {
        // 장소 정보 가져오기
        const locationData = await getLocationById(locationId)
        setLocation(locationData)

        if (locationData) {
          // 관련 단어 가져오기
          const relatedVocab = await getRelatedVocabulary(locationId)

          // 카테고리별로 그룹화
          const categories = relatedVocab.reduce<Record<string, Vocabulary[]>>((acc, word) => {
            if (!acc[word.category]) {
              acc[word.category] = []
            }
            acc[word.category].push(word)
            return acc
          }, {})

          // 카테고리별 배열로 변환
          const categorizedVocab = Object.entries(categories).map(([category, words]) => ({
            category,
            words,
          }))

          setVocabularyCategories(categorizedVocab)
        }
      } catch (error) {
        console.error("Failed to load location vocabulary:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLocationVocabulary()
  }, [locationId])

  const toggleSaved = (wordId: string) => {
    if (savedWords.includes(wordId)) {
      setSavedWords(savedWords.filter((id) => id !== wordId))
    } else {
      setSavedWords([...savedWords, wordId])
    }
  }

  const toggleDetails = (wordId: string) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [wordId]: !prev[wordId],
    }))
  }

  if (loading) {
    return (
      <div>
        <div className="mb-8 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-64 md:h-auto bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-3 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">장소를 찾을 수 없습니다</h3>
        <p className="text-muted-foreground">요청하신 장소 정보를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-64 md:h-auto">
            <Image
              src={
                location.image || `/placeholder.svg?height=600&width=800&query=${location.imageQuery || location.name}`
              }
              alt={location.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent md:bg-gradient-to-r"></div>
            <div className="absolute bottom-4 left-4 md:left-1/2 md:bottom-1/2 md:translate-y-1/2 md:-translate-x-1/2 text-white z-10">
              <Badge className="mb-2 bg-sakura-500 hover:bg-sakura-600">{location.region}</Badge>
              <h3 className="text-2xl font-bold mb-1">{location.name}</h3>
              <p className="text-white/80">{location.nameJp}</p>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">{location.description}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              이 장소에서 사용할 수 있는 단어들을 학습하고 실제 상황에서 활용해보세요. 각 단어는 실제 회화 예문과 함께
              제공됩니다.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-sakura-200 text-sakura-700 hover:bg-sakura-50 dark:border-sakura-900/50 dark:text-sakura-400 dark:hover:bg-sakura-950/30"
              >
                <Link href={`/local-picks/${location.id}`}>장소 상세 보기</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-ocean-200 text-ocean-700 hover:bg-ocean-50 dark:border-ocean-900/50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
              >
                <Link href={`/phrases?location=${location.id}`}>관련 회화 학습</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {vocabularyCategories.length > 0 ? (
        <Tabs defaultValue={vocabularyCategories[0].category} className="mb-8">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto">
            {vocabularyCategories.map((category) => (
              <TabsTrigger key={category.category} value={category.category}>
                {category.category}
              </TabsTrigger>
            ))}
          </TabsList>

          {vocabularyCategories.map((category) => (
            <TabsContent key={category.category} value={category.category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.words.map((word) => (
                  <Card
                    key={word.id}
                    className={cn(
                      "overflow-hidden card-hover border-gray-100 dark:border-gray-800",
                      savedWords.includes(word.id) ? "border-ocean-300 dark:border-ocean-700" : "",
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
                          <p className="mt-1">{word.kr}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${
                            savedWords.includes(word.id)
                              ? "text-ocean-500 hover:text-ocean-600 hover:bg-ocean-50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
                              : ""
                          }`}
                          onClick={() => toggleSaved(word.id)}
                        >
                          <BookOpen className="h-4 w-4" />
                        </Button>
                      </div>

                      {word.example && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <p className="text-sm italic text-gray-600 dark:text-gray-400">{word.example}</p>
                        </div>
                      )}

                      {word.relatedPhraseIds && word.relatedPhraseIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-between text-ocean-700 hover:text-ocean-800 hover:bg-ocean-50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
                            onClick={() => toggleDetails(word.id)}
                          >
                            <span>관련 회화 보기</span>
                            {expandedDetails[word.id] ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>

                          {expandedDetails[word.id] && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                                <MessageSquare className="h-4 w-4 text-ocean-500" />
                                <span>관련 회화</span>
                              </h4>
                              <ul className="space-y-2">
                                {word.relatedPhraseIds.slice(0, 2).map((phraseId, phraseIdx) => (
                                  <li key={phraseIdx} className="flex items-center text-sm">
                                    <VolumeUp className="h-4 w-4 mr-2 text-ocean-500 flex-shrink-0" />
                                    <Link
                                      href={`/phrases?phrase=${phraseId}`}
                                      className="text-gray-600 dark:text-gray-400"
                                    >
                                      관련 회화 {phraseIdx + 1}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">관련 단어가 없습니다</h3>
          <p className="text-muted-foreground">이 장소와 관련된 단어가 아직 등록되지 않았습니다.</p>
        </div>
      )}

      <div className="flex justify-center mt-12">
        <Button className="bg-gradient-to-r from-ocean-500 to-ocean-600 hover:from-ocean-600 hover:to-ocean-700 text-white font-medium">
          장소별 단어 퀴즈 시작하기
        </Button>
      </div>
    </div>
  )
}
