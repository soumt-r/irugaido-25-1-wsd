import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PhraseList from "@/components/phrase-list"
import { getPhrases, getLocations } from "@/lib/data-utils"

interface PhrasesPageProps {
  searchParams: Promise<{
    location?: string
    situation?: string
    level?: string
    search?: string
  }>
}

export default async function PhrasesPage({ searchParams }: PhrasesPageProps) {
  const { location: locationId, situation, level, search } = await searchParams

  // 모든 회화 표현 가져오기
  const allPhrases = await getPhrases()

  // 필터링 조건에 따라 표현 필터링
  let filteredPhrases = [...allPhrases]

  if (locationId) {
    filteredPhrases = filteredPhrases.filter((phrase) => phrase.relatedLocationIds.includes(locationId))
  }

  if (situation) {
    filteredPhrases = filteredPhrases.filter((phrase) => phrase.situation.toLowerCase() === situation.toLowerCase())
  }

  if (level) {
    filteredPhrases = filteredPhrases.filter((phrase) => phrase.level.toLowerCase() === level.toLowerCase())
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredPhrases = filteredPhrases.filter(
      (phrase) => phrase.jp.toLowerCase().includes(searchLower) || phrase.kr.toLowerCase().includes(searchLower),
    )
  }

  // 상황별 그룹화
  const situations = Array.from(new Set(allPhrases.map((phrase) => phrase.situation)))

  // 레벨별 그룹화
  const levels = Array.from(new Set(allPhrases.map((phrase) => phrase.level)))

  // 장소 정보 가져오기
  const locations = await getLocations()
  const currentLocation = locationId ? locations.find((loc) => loc.id === locationId) : null

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">일본어 회화</h1>
          <p className="text-muted-foreground">
            {currentLocation
              ? `${currentLocation.name}에서 활용할 수 있는 표현들을 배워보세요.`
              : "상황별 일본어 회화 표현을 배워보세요."}
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/phrases/saved">저장한 표현</Link>
          </Button>
        </div>
      </div>

      {currentLocation && (
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div>
              <h2 className="font-medium">{currentLocation.name}</h2>
              <p className="text-sm text-muted-foreground">
                {currentLocation.region} / {currentLocation.prefecture}
              </p>
            </div>
            <Button asChild variant="link" size="sm" className="ml-auto">
              <Link href={`/local-picks/${currentLocation.id}`}>장소 정보 보기</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="situations">상황별</TabsTrigger>
          <TabsTrigger value="levels">레벨별</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <PhraseList phrases={filteredPhrases} />
        </TabsContent>

        <TabsContent value="situations">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {situations.map((situation) => (
              <Card key={situation} className="overflow-hidden">
                <Link href={`/phrases/situation/${encodeURIComponent(situation.toLowerCase())}`}>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{situation}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {allPhrases.filter((p) => p.situation === situation).length}개 표현
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="levels">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {levels.map((level) => (
              <Card key={level} className="overflow-hidden">
                <Link href={`/phrases/level/${encodeURIComponent(level.toLowerCase())}`}>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{level}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {allPhrases.filter((p) => p.level === level).length}개 표현
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {level === "초급" ? "쉬움" : level === "중급" ? "보통" : "어려움"}
                    </Badge>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
