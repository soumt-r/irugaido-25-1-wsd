import { getVocabularyById } from "@/lib/data-utils"
import VocabularyDetail from "@/components/vocabulary-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function VocabularyWordPage({ params }: { params: { id: string } }) {
  const vocabulary = await getVocabularyById(params.id)

  if (!vocabulary) {
    return notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/vocabulary" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>단어장으로 돌아가기</span>
          </Link>
        </Button>
      </div>

      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">단어 상세 정보</h1>
        <VocabularyDetail vocabulary={vocabulary} />
      </div>
    </div>
  )
}
