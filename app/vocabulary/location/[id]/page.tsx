import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import LocationVocabulary from "@/components/location-vocabulary"

export const metadata: Metadata = {
  title: "장소별 단어장 - 이루가이도",
  description: "특정 장소에서 사용할 수 있는 일본어 단어를 학습하세요.",
}

export default function LocationVocabularyPage({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative h-[40vh] min-h-[300px] w-full overflow-hidden bg-gradient-to-b from-ocean-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="absolute inset-0 japanese-pattern opacity-30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-3xl">
            <div className="inline-flex items-center justify-center p-1 mb-4 bg-ocean-100 dark:bg-ocean-900/30 rounded-full">
              <span className="px-3 py-1 text-sm font-medium text-ocean-700 dark:text-ocean-300">장소별 단어장</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
              <span className="gradient-text">츠케지 시장</span> 단어장
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              츠케지 시장에서 사용할 수 있는 일본어 단어를 학습하고 실제 상황에서 활용해보세요.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button
            variant="outline"
            asChild
            className="flex items-center gap-2 border-ocean-200 text-ocean-700 hover:bg-ocean-50 dark:border-ocean-900/50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
          >
            <Link href="/vocabulary">
              <ArrowLeft className="h-4 w-4" />
              <span>단어장으로 돌아가기</span>
            </Link>
          </Button>
        </div>

        <LocationVocabulary locationId={params.id} />
      </section>
    </main>
  )
}
