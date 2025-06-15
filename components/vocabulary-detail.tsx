"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VolumeIcon as VolumeUp, BookOpen, MapPin, MessageSquare, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  getLocationsReferencingVocabulary,
  getPhrasesReferencingVocabulary,
  getRandomSample,
  type Vocabulary,
  type Location,
  type Phrase,
} from "@/lib/data-utils"

interface VocabularyDetailProps {
  vocabulary: Vocabulary
}

export default function VocabularyDetail({ vocabulary }: VocabularyDetailProps) {
  const [saved, setSaved] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [relatedLocations, setRelatedLocations] = useState<Location[]>([])
  const [relatedPhrases, setRelatedPhrases] = useState<Phrase[]>([])

  const toggleSaved = () => setSaved(!saved)
  const toggleTranslation = () => setShowTranslation(!showTranslation)

  const toggleExpanded = async () => {
    setExpanded(!expanded)

    if (!expanded && relatedLocations.length === 0 && relatedPhrases.length === 0 && !loading) {
      setLoading(true)

      try {
        const [locations, phrases] = await Promise.all([
          getLocationsReferencingVocabulary(vocabulary.id),
          getPhrasesReferencingVocabulary(vocabulary.id),
        ])

        // 랜덤으로 5개까지 선택
        setRelatedLocations(getRandomSample(locations, 5))
        setRelatedPhrases(getRandomSample(phrases, 5))
      } catch (error) {
        console.error("Failed to load related data:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Card className={`overflow-hidden ${saved ? "border-primary" : ""}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{vocabulary.jp}</span>
            <Button variant="ghost" size="icon" className="text-primary">
              <VolumeUp className="h-5 w-5" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 ${saved ? "text-primary" : ""}`}
            onClick={toggleSaved}
          >
            <BookOpen className="h-5 w-5" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-xl mb-1">{vocabulary.kr}</p>
          <p className="text-sm text-muted-foreground">{vocabulary.romaji}</p>
        </div>

        {vocabulary.example && (
          <div className="pt-3 border-t">
            <p className="text-sm italic">{vocabulary.example}</p>
            <div className="flex items-center justify-between mt-1">
              <p className={`text-sm ${showTranslation ? "" : "blur-sm hover:blur-none"}`}>{vocabulary.exampleKr}</p>
              <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={toggleTranslation}>
                {showTranslation ? "번역 숨기기" : "번역 보기"}
              </Button>
            </div>
          </div>
        )}

        <div className="pt-3 border-t">
          <p className="font-medium mb-2">카테고리:</p>
          <Badge>{vocabulary.category}</Badge>

          {vocabulary.tags.length > 0 && (
            <div className="mt-3">
              <p className="font-medium mb-2">태그:</p>
              <div className="flex flex-wrap gap-2">
                {vocabulary.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t">
          <Button variant="ghost" size="sm" className="w-full justify-between" onClick={toggleExpanded}>
            <span>관련 장소 및 회화 보기</span>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {expanded && (
            <div className="mt-3 space-y-4">
              {/* 로딩 중 표시 */}
              {loading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {/* 관련 장소 섹션 */}
              {relatedLocations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>이 단어가 사용되는 장소</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {relatedLocations.map((location, idx) => (
                      <Link key={idx} href={`/local-picks/${location.id}`}>
                        <Badge className="cursor-pointer" variant="outline">
                          {location.name} ({location.region})
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 관련 회화 섹션 */}
              {relatedPhrases.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span>이 단어가 사용되는 회화</span>
                  </h4>
                  <ul className="space-y-2">
                    {relatedPhrases.map((phrase, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <VolumeUp className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                        <Link href={`/phrases?phrase=${phrase.id}`} className="hover:text-primary">
                          {phrase.jp}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 관련 데이터가 없는 경우 */}
              {!loading && relatedLocations.length === 0 && relatedPhrases.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">이 단어와 관련된 장소나 회화가 없습니다.</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
