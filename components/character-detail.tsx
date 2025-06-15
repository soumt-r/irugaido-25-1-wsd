"use client"

import Link from "next/link"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VolumeIcon as VolumeUp } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Character } from "@/lib/data-utils"

interface CharacterDetailProps {
  character: Character
}

export default function CharacterDetail({ character }: CharacterDetailProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setOpen(true)}>
        <CardContent className="flex flex-col items-center justify-center p-4 h-24">
          <span className="text-3xl font-bold mb-2">{character.character}</span>
          <span className="text-sm text-muted-foreground">{character.romaji}</span>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-4xl">{character.character}</span>
              <span className="text-xl text-muted-foreground">{character.romaji}</span>
              <Button variant="ghost" size="icon" className="ml-auto">
                <VolumeUp className="h-5 w-5" />
              </Button>
            </DialogTitle>
            <DialogDescription>아래 예시 단어를 통해 문자 사용법을 배워보세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <h3 className="font-medium">예시 단어</h3>
            <ul className="space-y-3">
              {character.examples.map((example, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{example.word}</p>
                    <p className="text-sm text-muted-foreground">{example.meaning}</p>
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
              <Button variant="outline" className="w-full mt-3" asChild>
                <Link href={`/vocabulary?character=${character.character}`}>관련 단어 보기</Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
