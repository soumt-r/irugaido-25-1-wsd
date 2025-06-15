import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import PhraseList from "@/components/phrase-list"
import type { Phrase } from "@/lib/data-utils"

export default function SavedPhrasesPage() {
  const [savedPhrases, setSavedPhrases] = useState<Phrase[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSavedPhrases = async () => {
      try {
        // 저장된 회화 ID 목록 가져오기
        const savedIds = JSON.parse(localStorage.getItem("savedPhrases") || "[]")

        if (savedIds.length === 0) {
          setSavedPhrases([])
          setIsLoading(false)
          return
        }

        // 모든 회화 데이터 가져오기
        const res = await fetch("/data/phrases.json")
        const data = await res.json()
        const allPhrases = data.phrases || []

        // 저장된 ID에 해당하는 회화만 필터링
        const phrases = allPhrases.filter((phrase: Phrase) => savedIds.includes(phrase.id))
        setSavedPhrases(phrases)
      } catch (error) {
        console.error("Error loading saved phrases:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedPhrases()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href="/phrases">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">저장한 표현</h1>
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground">저장한 일본어 표현을 확인하고 복습하세요.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sakura-500"></div>
        </div>
      ) : savedPhrases.length > 0 ? (
        <PhraseList phrases={savedPhrases} />
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">저장한 표현이 없습니다</h3>
          <p className="text-muted-foreground mb-4">유용한 표현을 저장하고 나중에 복습해보세요.</p>
          <Button asChild>
            <Link href="/phrases">회화 둘러보기</Link>
          </Button>
        </div>
      )}
    </main>
  )
}
