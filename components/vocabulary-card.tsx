"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VolumeIcon as VolumeUp, BookOpen, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Vocabulary } from "@/lib/data-utils"

interface VocabularyCardProps {
  vocabulary: Vocabulary
  showDetails?: boolean
}

export default function VocabularyCard({ vocabulary, showDetails = true }: VocabularyCardProps) {
  const [saved, setSaved] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const toggleSaved = () => {
    setSaved(!saved)
  }

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  return (
    <Card className={`overflow-hidden ${saved ? "border-primary" : ""}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold">{vocabulary.jp}</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary hover:text-primary-foreground hover:bg-primary"
              >
                <VolumeUp className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-1">{vocabulary.kr}</p>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              {vocabulary.category}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${saved ? "text-primary" : ""}`}
              onClick={toggleSaved}
            >
              <BookOpen className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {vocabulary.example && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm italic text-gray-600 dark:text-gray-400">{vocabulary.example}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{vocabulary.exampleKr}</p>
          </div>
        )}

        {showDetails && (
          <div className="mt-3 pt-3 border-t">
            <Button variant="ghost" size="sm" className="w-full justify-between" onClick={toggleExpanded}>
              <span>관련 정보 보기</span>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {expanded && (
              <div className="mt-3 space-y-3">
                {vocabulary.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">태그:</p>
                    <div className="flex flex-wrap gap-1">
                      {vocabulary.tags.map((tag, idx) => (
                        <Link key={idx} href={`/vocabulary?tag=${encodeURIComponent(tag)}`}>
                          <Badge variant="secondary" className="text-xs cursor-pointer">
                            {tag}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {vocabulary.relatedLocationIds.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">관련 장소:</p>
                    <div className="flex flex-wrap gap-1">
                      {vocabulary.relatedLocationIds.map((id, idx) => (
                        <Button key={idx} variant="outline" size="sm" asChild className="text-xs h-7">
                          <Link href={`/local-picks/${id}`}>장소 {idx + 1}</Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {vocabulary.relatedPhraseIds.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">관련 회화:</p>
                    <div className="flex flex-wrap gap-1">
                      {vocabulary.relatedPhraseIds.map((id, idx) => (
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
        )}
      </CardContent>
    </Card>
  )
}
