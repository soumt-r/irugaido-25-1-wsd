import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CharacterGrid from "@/components/character-grid"

export const metadata: Metadata = {
  title: "문자 학습 - 일본 여행 일본어",
  description: "히라가나와 가타카나를 배워보세요.",
}

export default function CharactersPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-4">일본어 문자 학습</h1>
          <p className="text-muted-foreground max-w-2xl">
            히라가나와 가타카나를 배워보세요. 각 문자의 발음과 예시 단어를 통해 쉽게 학습할 수 있습니다.
          </p>
        </div>

        <Tabs defaultValue="hiragana" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="hiragana">히라가나</TabsTrigger>
            <TabsTrigger value="katakana">가타카나</TabsTrigger>
          </TabsList>
          <TabsContent value="hiragana" className="mt-6">
            <CharacterGrid type="hiragana" />
          </TabsContent>
          <TabsContent value="katakana" className="mt-6">
            <CharacterGrid type="katakana" />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
