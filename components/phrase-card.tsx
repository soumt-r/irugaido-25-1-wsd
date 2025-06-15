"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VolumeIcon as VolumeUp, BookmarkIcon, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { type Phrase, type Location, getLocationById } from "@/lib/data-utils"

interface PhraseCardProps {
  phrase?: Phrase
  phrases?: Phrase[]
  locationId?: string
  showLocation?: boolean
}

export default function PhraseCard({ phrase, phrases = [], locationId, showLocation = false }: PhraseCardProps) {
  const { toast } = useToast()
  const [savedPhrases, setSavedPhrases] = useState<string[]>([])
  const [location, setLocation] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 표시할 문구들
  const displayPhrases = phrase ? [phrase] : phrases

  useEffect(() => {
    // 로컬 스토리지에서 저장된 표현 불러오기
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedPhrases")
      setSavedPhrases(saved ? JSON.parse(saved) : [])
    }

    // 장소 ID가 있으면 장소 정보 불러오기
    const fetchLocation = async () => {
      if (locationId) {
        setIsLoading(true)
        try {
          const loc = await getLocationById(locationId)
          setLocation(loc)
        } catch (error) {
          console.error("장소 정보를 불러오는 중 오류 발생:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchLocation()
  }, [locationId])

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

  const playAudio = () => {
    toast({
      title: "오디오 재생",
      description: "오디오 기능은 아직 준비 중입니다.",
    })
  }

  if (displayPhrases.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">표시할 표현이 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          {locationId && (
            <>
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              {isLoading ? (
                "장소 정보 로딩 중..."
              ) : location ? (
                <>{location.name}에서 활용할 수 있는 표현</>
              ) : (
                "장소별 활용 표현"
              )}
            </>
          )}
          {!locationId && "자주 사용하는 표현"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {displayPhrases.map((p) => (
            <div key={p.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {p.situation}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {p.level}
                </Badge>
              </div>
              <p className="font-medium text-lg mb-1">{p.jp}</p>
              <p className="text-muted-foreground mb-2">{p.kr}</p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={playAudio}>
                  <VolumeUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${savedPhrases.includes(p.id) ? "text-primary" : "text-muted-foreground"}`}
                  onClick={() => toggleSave(p.id)}
                >
                  <BookmarkIcon className={`h-4 w-4 ${savedPhrases.includes(p.id) ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <Button asChild variant="outline">
            <Link href={locationId ? `/phrases?location=${locationId}` : "/phrases"}>더 많은 표현 보기</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
