import type { Metadata } from "next"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, MapPin, ArrowLeft, BookOpen, Brain } from "lucide-react"
import VocabularyList from "@/components/vocabulary-list"
import Link from "next/link"
import { getVocabulary, getLocationById } from "@/lib/data-utils"

export const metadata: Metadata = {
  title: "단어장 - 이루가이도",
  description: "일본 여행에 필요한 기초 단어를 카테고리별, 장소별로 학습해보세요.",
}

export default async function VocabularyPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string; phrase?: string; categories?: string }>
}) {
  // searchParams를 await로 처리
  const { location, phrase, categories } = await searchParams

  // 실제 location ID를 사용하여 장소 정보 가져오기
  const locationInfo = location ? await getLocationById(location) : null

  const phraseInfo = phrase
    ? {
        id: phrase,
        situation: "식당에서",
      }
    : null

  // 모든 단어 가져오기
  const allVocabulary = await getVocabulary()

  // 선택된 카테고리들 파싱 (기본값 없음)
  const selectedCategories = categories ? categories.split(",") : []

  // 데이터에서 사용 가능한 카테고리들 추출
  const availableCategories = Array.from(new Set(allVocabulary.map((word) => word.category))).sort()

  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative h-[40vh] min-h-[300px] w-full overflow-hidden bg-gradient-to-b from-ocean-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="absolute inset-0 japanese-pattern opacity-30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-3xl">
            <div className="inline-flex items-center justify-center p-1 mb-4 bg-ocean-100 dark:bg-ocean-900/30 rounded-full">
              <span className="px-3 py-1 text-sm font-medium text-ocean-700 dark:text-ocean-300">단어장</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
              <span className="gradient-text">장소별로 배우는</span> 일본어 단어장
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              일본 여행에 필요한 기초 단어를 카테고리별, 장소별로 학습하고 퀴즈를 통해 학습 진도를 확인해보세요.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ocean-500" />
            <Input
              placeholder="단어 검색"
              className="pl-10 border-ocean-200 dark:border-ocean-900/50 focus:ring-ocean-500"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-ocean-200 text-ocean-700 hover:bg-ocean-50 dark:border-ocean-900/50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
            >
              <Filter className="h-4 w-4" />
              필터
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-ocean-200 text-ocean-700 hover:bg-ocean-50 dark:border-ocean-900/50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
              asChild
            >
              <Link href="/vocabulary/saved">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>저장된 단어</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* 장소나 회화에서 넘어온 경우 표시 */}
        {locationInfo && (
          <div className="mb-8 p-4 bg-ocean-50 border border-ocean-200 rounded-lg dark:bg-ocean-900/20 dark:border-ocean-900/30">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-ocean-500" />
              <div>
                <h3 className="font-medium">{locationInfo.name}에서 활용할 수 있는 단어</h3>
                <p className="text-sm text-muted-foreground">이 장소에서 사용할 수 있는 단어들을 모아보고 있습니다.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto border-ocean-200 text-ocean-700 hover:bg-ocean-50 dark:border-ocean-900/50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
                asChild
              >
                <Link href={`/local-picks/${locationInfo.id}`}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  장소로 돌아가기
                </Link>
              </Button>
            </div>
          </div>
        )}

        {phraseInfo && (
          <div className="mb-8 p-4 bg-sakura-50 border border-sakura-200 rounded-lg dark:bg-sakura-900/20 dark:border-sakura-900/30">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-sakura-500" />
              <div>
                <h3 className="font-medium">{phraseInfo.situation} 상황에서 활용할 수 있는 단어</h3>
                <p className="text-sm text-muted-foreground">
                  이 회화 상황에서 사용할 수 있는 단어들을 모아보고 있습니다.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto border-sakura-200 text-sakura-700 hover:bg-sakura-50 dark:border-sakura-900/50 dark:text-sakura-400 dark:hover:bg-sakura-950/30"
                asChild
              >
                <Link href={`/phrases/${phraseInfo.id}`}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  회화로 돌아가기
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* 단어 목록 컴포넌트 */}
        <VocabularyList
          selectedCategories={selectedCategories}
          words={allVocabulary}
          availableCategories={availableCategories}
          locationFilter={locationInfo?.id}
        />

        
      </section>
    </main>
  )
}
