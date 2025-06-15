"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VolumeIcon as VolumeUp, ChevronDown, ChevronUp, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { getVocabulary, type Vocabulary } from "@/lib/data-utils"

// 예시 데이터 - 실제 구현에서는 사용자의 저장된 단어 데이터를 가져와야 함
export default function SavedVocabulary() {
  const [expandedDetails, setExpandedDetails] = useState<number[]>([])
  const [removedWords, setRemovedWords] = useState<string[]>([])
  const [savedWords, setSavedWords] = useState<Vocabulary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSavedVocabulary() {
      try {
        // 실제 구현에서는 사용자의 저장된 단어 ID를 가져와서 필터링해야 함
        // 여기서는 예시로 처음 5개의 단어를 "저장된 단어"로 표시
        const allVocabulary = await getVocabulary()
        setSavedWords(allVocabulary.slice(0, 5))
      } catch (error) {
        console.error("Failed to load saved vocabulary:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSavedVocabulary()
  }, [])

  const toggleDetails = (id: string) => {
    if (expandedDetails.includes(Number.parseInt(id))) {
      setExpandedDetails(expandedDetails.filter((i) => i !== Number.parseInt(id)))
    } else {
      setExpandedDetails([...expandedDetails, Number.parseInt(id)])
    }
  }

  const removeWord = (id: string) => {
    setRemovedWords([...removedWords, id])
  }

  const filteredWords = savedWords.filter((word) => !removedWords.includes(word.id))

  if (loading) {
    return (
      <div>
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid grid-cols-5 max-w-2xl mx-auto">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="food">음식</TabsTrigger>
            <TabsTrigger value="transportation">교통</TabsTrigger>
            <TabsTrigger value="accommodation">숙박</TabsTrigger>
            <TabsTrigger value="shopping">쇼핑</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-3 animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div>
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid grid-cols-5 max-w-2xl mx-auto">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="food">음식</TabsTrigger>
          <TabsTrigger value="transportation">교통</TabsTrigger>
          <TabsTrigger value="accommodation">숙박</TabsTrigger>
          <TabsTrigger value="shopping">쇼핑</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWords.map((word) => (
              <WordCard
                key={word.id}
                word={word}
                isExpanded={expandedDetails.includes(Number.parseInt(word.id))}
                onToggleDetails={() => toggleDetails(word.id)}
                onRemove={() => removeWord(word.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="food" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWords
              .filter((word) => word.category === "음식")
              .map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  isExpanded={expandedDetails.includes(Number.parseInt(word.id))}
                  onToggleDetails={() => toggleDetails(word.id)}
                  onRemove={() => removeWord(word.id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="transportation" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWords
              .filter((word) => word.category === "교통")
              .map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  isExpanded={expandedDetails.includes(Number.parseInt(word.id))}
                  onToggleDetails={() => toggleDetails(word.id)}
                  onRemove={() => removeWord(word.id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="accommodation" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWords
              .filter((word) => word.category === "숙박")
              .map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  isExpanded={expandedDetails.includes(Number.parseInt(word.id))}
                  onToggleDetails={() => toggleDetails(word.id)}
                  onRemove={() => removeWord(word.id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="shopping" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWords
              .filter((word) => word.category === "쇼핑")
              .map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  isExpanded={expandedDetails.includes(Number.parseInt(word.id))}
                  onToggleDetails={() => toggleDetails(word.id)}
                  onRemove={() => removeWord(word.id)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredWords.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 dark:text-gray-400">저장된 단어가 없습니다.</p>
          <Button
            className="mt-4 bg-gradient-to-r from-ocean-500 to-ocean-600 hover:from-ocean-600 hover:to-ocean-700 text-white font-medium"
            asChild
          >
            <Link href="/vocabulary">단어장으로 이동</Link>
          </Button>
        </div>
      )}

      {filteredWords.length > 0 && (
        <div className="flex justify-center mt-12">
          <Button className="bg-gradient-to-r from-ocean-500 to-ocean-600 hover:from-ocean-600 hover:to-ocean-700 text-white font-medium">
            저장된 단어 퀴즈 시작하기
          </Button>
        </div>
      )}
    </div>
  )
}

interface WordCardProps {
  word: Vocabulary
  isExpanded: boolean
  onToggleDetails: () => void
  onRemove: () => void
}

function WordCard({ word, isExpanded, onToggleDetails, onRemove }: WordCardProps) {
  return (
    <Card className={cn("overflow-hidden card-hover border-ocean-200 dark:border-ocean-900/50")}>
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
          <div className="flex items-center gap-1">
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                word.category === "음식"
                  ? "border-sakura-200 text-sakura-700 dark:border-sakura-900/50 dark:text-sakura-400"
                  : word.category === "교통"
                    ? "border-ocean-200 text-ocean-700 dark:border-ocean-900/50 dark:text-ocean-400"
                    : word.category === "숙박"
                      ? "border-matcha-200 text-matcha-700 dark:border-matcha-900/50 dark:text-matcha-400"
                      : "border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300",
              )}
            >
              {word.category}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {word.example && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm italic text-gray-600 dark:text-gray-400">{word.example}</p>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-ocean-700 hover:text-ocean-800 hover:bg-ocean-50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
            onClick={onToggleDetails}
          >
            <span>관련 장소 및 회화 보기</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {isExpanded && (
            <div className="mt-3 space-y-4">
              {word.tags && word.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">태그:</p>
                  <div className="flex flex-wrap gap-1">
                    {word.tags.map((tag, idx) => (
                      <Link key={idx} href={`/vocabulary?tag=${encodeURIComponent(tag)}`}>
                        <Badge variant="secondary" className="text-xs cursor-pointer">
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {word.relatedLocationIds && word.relatedLocationIds.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">관련 장소:</p>
                  <div className="flex flex-wrap gap-1">
                    {word.relatedLocationIds.map((id, idx) => (
                      <Button key={idx} variant="outline" size="sm" asChild className="text-xs h-7">
                        <Link href={`/local-picks/${id}`}>장소 {idx + 1}</Link>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {word.relatedPhraseIds && word.relatedPhraseIds.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">관련 회화:</p>
                  <div className="flex flex-wrap gap-1">
                    {word.relatedPhraseIds.map((id, idx) => (
                      <Button key={idx} variant="outline" size="sm" asChild className="text-xs h-7">
                        <Link href={`/phrases?phrase=${id}`}>회화 {idx + 1}</Link>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
