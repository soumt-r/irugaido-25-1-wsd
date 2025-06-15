"use client"

import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import PhraseList from "@/components/phrase-list"
import { getPhrasesBySituation } from "@/lib/data-utils"

interface SituationPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: SituationPageProps): Promise<Metadata> {
  const situation = decodeURIComponent(params.slug)

  return {
    title: `${situation} 회화 - 일본 여행 일본어`,
    description: `${situation}에서 사용할 수 있는 유용한 일본어 표현을 배워보세요.`,
  }
}

export default async function SituationPage({ params }: SituationPageProps) {
  const situation = decodeURIComponent(params.slug)
  const phrases = await getPhrasesBySituation(situation)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href="/phrases">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{situation} 회화</h1>
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground">
          {situation}에서 사용할 수 있는 유용한 일본어 표현 {phrases.length}개를 확인해보세요.
        </p>
      </div>

      <PhraseList phrases={phrases} />
    </main>
  )
}
