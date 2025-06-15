"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VolumeIcon as VolumeUp, Mic, MapPin, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getPhrases, type Phrase } from "@/lib/data-utils"

export default function SavedPhrases() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSavedPhrases() {
      try {
        // 실제 구현에서는 사용자의 저장된 표현 ID를 가져와서 필터링해야 함
        // 여기서는 예시로 처음 6개의 표현을 "저장된 표현"으로 표시
        const allPhrases = await getPhrases()
        setPhrases(allPhrases.slice(0, 6))
      } catch (error) {
        console.error("Failed to load saved phrases:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSavedPhrases()
  }, [])

  if (loading) {
    return (
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
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {phrases.map((phrase) => (
        <Card key={phrase.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <Badge className="mb-2">{phrase.situation}</Badge>
                <p className="font-medium text-lg mb-1">{phrase.jp}</p>
                <p className="text-muted-foreground">{phrase.kr}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                  <VolumeUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {phrase.relatedLocationIds && phrase.relatedLocationIds.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/local-picks/${phrase.relatedLocationIds[0]}`}>
                    <MapPin className="h-4 w-4 mr-1" /> 관련 장소 보기
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
