import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  ArrowLeft,
  Share2,
  Bookmark,
  VolumeIcon as VolumeUp,
  MapPin,
  Clock,
  Phone,
  Globe,
  User,
  MessageCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  getLocationById,
  getRelatedPhrases,
  getRelatedVocabulary,
  getNearbyLocations,
  prefectureNameMap,
} from "@/lib/data-utils"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const location = await getLocationById(params.id)

  if (!location) {
    return {
      title: "장소를 찾을 수 없음",
      description: "요청하신 장소를 찾을 수 없습니다.",
    }
  }

  return {
    title: `${location.name} - 이루가이도`,
    description: location.description,
  }
}

export default async function LocationDetailPage({ params }: { params: { id: string } }) {
  const location = await getLocationById(params.id)

  if (!location) {
    notFound()
  }

  // 관련 데이터 가져오기
  const relatedPhrases = await getRelatedPhrases(location.id)
  const relatedVocabulary = await getRelatedVocabulary(location.id)
  const nearbyLocations = await getNearbyLocations(location.id)

  return (
    <main className="flex min-h-screen flex-col">
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={location.image}
          alt={location.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 text-white hover:bg-black/50 hover:text-white"
            asChild
          >
            <Link href="/local-picks">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button variant="ghost" size="icon" className="bg-black/30 text-white hover:bg-black/50 hover:text-white">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-black/30 text-white hover:bg-black/50 hover:text-white">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex gap-2 mb-2">
            <Badge>{prefectureNameMap[location.prefecture] || location.prefecture}</Badge>
            {location.isLocalRecommended && (
              <Badge variant="outline" className="bg-primary/10 border-primary/30">
                현지인 추천
              </Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{location.name}</h1>
          <p className="text-xl text-white/80">{location.nameJp}</p>
          <div className="flex items-center mt-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 mr-2">{location.rating}</span>
            <span className="text-white/70">• {location.tags.join(", ")}</span>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* 현지인 추천 섹션 */}
            {location.isLocalRecommended && location.localExpert && (
              <Card className="mb-8 border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={`/placeholder.svg?height=100&width=100&query=japanese person ${location.localExpert.name}`}
                        alt={location.localExpert.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">{location.localExpert.name} 추천</h3>
                      </div>
                      <p className="text-sm">이 장소는 현지 전문가가 추천한 숨은 명소입니다.</p>
                      <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                        <MessageCircle className="h-3 w-3 mr-1" /> 메시지 보내기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-bold mb-4">소개</h2>
              <p className="text-muted-foreground">{location.longDescription || location.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">사진 갤러리</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="relative aspect-square overflow-hidden rounded-md">
                    <Image
                      src={`/placeholder.svg?height=400&width=400&query=${location.imageQuery || location.name} ${idx + 1}`}
                      alt={`${location.name} 이미지 ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">이 장소에서 사용할 수 있는 표현</h2>
              <div className="grid grid-cols-1 gap-3">
                {relatedPhrases.slice(0, 3).map((phrase) => (
                  <Card key={phrase.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-lg mb-1">{phrase.jp}</p>
                          <p className="text-muted-foreground">{phrase.kr}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                            <VolumeUp className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            저장
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <Button asChild>
                  <Link href={`/phrases?location=${location.id}`}>
                    <VolumeUp className="h-4 w-4 mr-2" /> 더 많은 표현 배우기
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">관련 단어</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedVocabulary.slice(0, 4).map((word) => (
                  <Card key={word.id}>
                    <CardContent className="p-3">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {word.category}
                      </Badge>
                      <p className="font-medium">{word.jp}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-muted-foreground">{word.kr}</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-primary">
                          <VolumeUp className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline" asChild>
                  <Link href={`/vocabulary?location=${location.id}`}>더 많은 단어 보기</Link>
                </Button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">현지인 팁</h2>
              <ul className="space-y-2">
                {location.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary h-6 w-6 text-sm font-medium mr-2 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">주변 명소</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {nearbyLocations.map((nearby) => (
                  <Card key={nearby.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">{nearby.name}</p>
                          <p className="text-sm text-muted-foreground">도보 10-15분</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">정보</h3>
                <ul className="space-y-4">
                  <li className="flex">
                    <MapPin className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">주소</p>
                      <p className="text-sm text-muted-foreground">{location.addressKr}</p>
                      <p className="text-sm">{location.address}</p>
                    </div>
                  </li>
                  <li className="flex">
                    <Clock className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">영업 시간</p>
                      <p className="text-sm">{location.hours}</p>
                    </div>
                  </li>
                  <li className="flex">
                    <Phone className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">전화번호</p>
                      <p className="text-sm">{location.phone}</p>
                    </div>
                  </li>
                  <li className="flex">
                    <Globe className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">웹사이트</p>
                      <a
                        href={location.website}
                        className="text-sm text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {location.website.replace("https://", "")}
                      </a>
                    </div>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">지도</h3>
                  <div className="aspect-video bg-muted rounded-md overflow-hidden relative">
                    <Image
                      src={`/placeholder.svg?height=300&width=400&query=${location.name} map`}
                      alt="지도"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground">지도 이미지</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-3">
                    지도에서 보기
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">공유하기</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </Button>
                    <Button variant="outline" className="flex-1">
                      링크 복사
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
