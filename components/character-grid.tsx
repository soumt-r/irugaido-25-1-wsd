"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VolumeIcon as VolumeUp } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { getCharactersByType, type Character } from "@/lib/data-utils"

interface CharacterGridProps {
  type: "hiragana" | "katakana"
}

export default function CharacterGrid({ type }: CharacterGridProps) {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCharacters() {
      try {
        const chars = await getCharactersByType(type)
        setCharacters(chars)
      } catch (error) {
        console.error(`Failed to load ${type} characters:`, error)
      } finally {
        setLoading(false)
      }
    }

    loadCharacters()
  }, [type])

  const openCharacterDetail = (char: Character) => {
    setSelectedChar(char)
  }

  const closeCharacterDetail = () => {
    setSelectedChar(null)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 md:gap-4">
        {Array.from({ length: 10 }).map((_, idx) => (
          <Card key={idx} className="h-24">
            <CardContent className="flex flex-col items-center justify-center p-4 h-full">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse mb-2"></div>
              <div className="w-6 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 md:gap-4">
        {characters.map((char, idx) => (
          <Card
            key={idx}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => openCharacterDetail(char)}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 h-24">
              <span className="text-3xl font-bold mb-2">{char.character}</span>
              <span className="text-sm text-muted-foreground">{char.romaji}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={selectedChar !== null} onOpenChange={closeCharacterDetail}>
        {selectedChar && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-4xl">{selectedChar.character}</span>
                <span className="text-xl text-muted-foreground">{selectedChar.romaji}</span>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <VolumeUp className="h-5 w-5" />
                </Button>
              </DialogTitle>
              <DialogDescription>아래 예시 단어를 통해 문자 사용법을 배워보세요.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <h3 className="font-medium">예시 단어</h3>
              <ul className="space-y-3">
                {selectedChar.examples.map((example, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{example}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <VolumeUp className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  이 문자를 포함하는 더 많은 단어와 표현을 보려면 단어장을 확인하세요.
                </p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
