"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VolumeIcon as VolumeUp, BookmarkIcon, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Phrase, Location } from "@/lib/data-utils"

interface PhraseListProps {
  phrases: Phrase[]
}

export default function PhraseList({ phrases }: PhraseListProps) {
  const { toast } = useToast()
  const [savedPhrases, setSavedPhrases] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedPhrases")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [expandedPhrases, setExpandedPhrases] = useState<Record<string, boolean>>({})
  const [relatedLocations, setRelatedLocations] = useState<Record<string, Location[]>>({})

  const toggleSave = (phraseId: string) => {
    const newSavedPhrases = savedPhrases.includes(phraseId)
      ? savedPhrases.filter((id) => id !== phraseId)
      : [...savedPhrases, phraseId]

    setSavedPhrases(newSavedPhrases)
    localStorage.setItem("savedPhrases", JSON.stringify(newSavedPhrases))

    toast({
      title: savedPhrases.includes(phraseId) ? "표현이 삭제되었습니다" : "표현이 저장되었습니다",
      description: savedPhrases.includes(phraseId)
        ? "저장된 표현 목록에서 삭제되었습니다."
        : "저장된 표현 목록에 추가되었습니다.",
    })
  }

  const toggleExpand = async (phraseId: string) => {
    setExpandedPhrases((prev) => ({
      ...prev,
      [phraseId]: !prev[phraseId],
    }))

    // 관련 장소 정보 로드
    if (!relatedLocations[phraseId] && !expandedPhrases[phraseId]) {
      const phrase = phrases.find((p) => p.id === phraseId)
      if (phrase) {
        try {
          const res = await fetch("/data/locations.json")
          const data = await res.json()
          const allLocations = data.locations || []
          const related = allLocations.filter((loc: Location) => phrase.relatedLocationIds.includes(loc.id))
          setRelatedLocations((prev) => ({
            ...prev,
            [phraseId]: related,
          }))
        } catch (error) {
          console.error("Error loading related locations:", error)
        }
      }
    }
  }

  const playAudio = (audioUrl: string) => {
    // 오디오 재생 로직 (실제 오디오 파일이 있을 때 구현)
    toast({
      title: "오디오 재생",
      description: "오디오 기능은 아직 준비 중입니다.",
    })
  }

  if (phrases.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">표현이 없습니다</h3>
        <p className="text-muted-foreground">선택한 조건에 맞는 표현이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {phrases.map((phrase) => (
        <Card key={phrase.id} className="border-gray-100 dark:border-gray-800">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {phrase.situation}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {phrase.level}
                  </Badge>
                </div>
                <p className="font-medium text-lg mb-1">{phrase.jp}</p>
                <p className="text-muted-foreground">{phrase.kr}</p>

                {expandedPhrases[phrase.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-sm font-medium mb-2">관련 장소</h4>
                    {relatedLocations[phrase.id]?.length > 0 ? (
                      <div className="space-y-2">
                        {relatedLocations[phrase.id].map((location) => (
                          <Link
                            href={`/local-picks/${location.id}`}
                            key={location.id}
                            className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <MapPin className="h-4 w-4 text-sakura-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-sm">{location.name}</p>
                              <p className="text-xs text-muted-foreground">{location.region}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">관련 장소 정보를 불러오는 중...</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary"
                  onClick={() => playAudio(phrase.audio)}
                >
                  <VolumeUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${savedPhrases.includes(phrase.id) ? "text-primary" : "text-muted-foreground"}`}
                  onClick={() => toggleSave(phrase.id)}
                >
                  <BookmarkIcon className={`h-4 w-4 ${savedPhrases.includes(phrase.id) ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="sm" onClick={() => toggleExpand(phrase.id)}>
                  {expandedPhrases[phrase.id] ? "접기" : "관련 장소 보기"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
