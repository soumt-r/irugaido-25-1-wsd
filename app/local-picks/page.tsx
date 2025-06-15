import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Search,
  Filter,
  VolumeIcon as VolumeUp,
  User,
  Star,
  Clock,
  Utensils,
  Coffee,
  Music,
  Camera,
  Mountain,
  ShoppingBag,
} from "lucide-react"
import PrefectureMap from "@/components/prefecture-map"
import { getLocations, getRelatedPhrases, type Location, prefectureNameMap } from "@/lib/data-utils"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "로컬 탐색 - 이루가이도",
  description: "일본 현지인이 추천하는 숨은 명소를 탐색해보세요.",
}

// 지역 이름 매핑 (영어 ID -> 한글 이름)
const regionNameMap: Record<string, string> = {
  hokkaido: "홋카이도",
  tohoku: "도호쿠",
  kanto: "간토",
  chubu: "추부",
  kinki: "긴키",
  chugoku: "주고쿠",
  shikoku: "시코쿠",
  kyushu: "규슈",
  okinawa: "오키나와",
}

export default async function LocalPicksPage({
  searchParams,
}: {
  searchParams: { region?: string; prefecture?: string; tag?: string }
}) {
  const { region, prefecture, tag } = searchParams

  // JSON 파일에서 장소 데이터 불러오기
  const locationData = await getLocations()

  // 지역 또는 도도부현으로 필터링
  let filteredLocations = [...locationData]

  if (prefecture) {
    // prefecture 값으로 직접 필터링 (JSON 데이터의 prefecture 필드와 매칭)
    filteredLocations = filteredLocations.filter((location) => location.prefecture === prefecture)
  } else if (region) {
    // region 값으로 필터링 (JSON 데이터의 region 필드와 매칭)
    filteredLocations = filteredLocations.filter((location) => location.region === region)
  }

  // 태그로 필터링
  if (tag) {
    filteredLocations = filteredLocations.filter((location) =>
      location.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
    )
  }

  // 필터 적용 중인지 확인
  const isFiltering = region || prefecture || tag

  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative h-[40vh] min-h-[300px] w-full overflow-hidden bg-gradient-to-b from-sakura-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="absolute inset-0 japanese-pattern opacity-30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-3xl">
            <div className="inline-flex items-center justify-center p-1 mb-4 bg-sakura-100 dark:bg-sakura-900/30 rounded-full">
              <span className="px-3 py-1 text-sm font-medium text-sakura-700 dark:text-sakura-300">로컬 탐색</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
              <span className="gradient-text">현지인이 추천하는</span> 숨은 명소
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              현지인이 추천하는 숨은 명소를 탐색하고 그곳에서 사용할 수 있는 일본어 표현을 배워보세요
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sakura-500" />
            <Input
              placeholder="장소, 지역, 키워드로 검색"
              className="pl-10 border-sakura-200 dark:border-sakura-900/50 focus:ring-sakura-500"
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-sakura-200 text-sakura-700 hover:bg-sakura-50 dark:border-sakura-900/50 dark:text-sakura-400 dark:hover:bg-sakura-950/30"
          >
            <Filter className="h-4 w-4" />
            필터
          </Button>
        </div>

        {/* 필터링 중일 때 표시할 알림 */}
        {isFiltering && (
          <div className="mb-8 p-4 bg-sakura-50 border border-sakura-200 rounded-lg dark:bg-sakura-900/20 dark:border-sakura-900/30">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-sakura-500" />
              <div>
                <h3 className="font-medium">
                  {prefecture
                    ? `${prefecture} 지역 명소`
                    : region
                      ? `${regionNameMap[region] || region} 지역 명소`
                      : tag
                        ? `${tag} 관련 명소`
                        : "필터링된 명소"}
                </h3>
                <p className="text-sm text-muted-foreground">{filteredLocations.length}개의 명소를 찾았습니다.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto border-sakura-200 text-sakura-700 hover:bg-sakura-50 dark:border-sakura-900/50 dark:text-sakura-400 dark:hover:bg-sakura-950/30"
                asChild
              >
                <Link href="/local-picks">필터 초기화</Link>
              </Button>
            </div>
          </div>
        )}

        {/* 도도부현 지도 선택기 */}
        <div className="mb-12 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-800">
          <PrefectureMap />
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">카테고리</h2>
          <div className="flex flex-wrap gap-3">
            {["음식점", "카페", "나이트라이프", "관광지", "자연", "쇼핑"].map((category, idx) => (
              <Link key={idx} href={`/local-picks?tag=${encodeURIComponent(category.toLowerCase())}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex items-center gap-1",
                    tag === category.toLowerCase()
                      ? "bg-sakura-100 border-sakura-300 text-sakura-700 dark:bg-sakura-900/30 dark:border-sakura-700 dark:text-sakura-400"
                      : "border-sakura-200 text-sakura-700 hover:bg-sakura-50 dark:border-sakura-900/50 dark:text-sakura-400 dark:hover:bg-sakura-950/30",
                  )}
                >
                  {idx === 0 ? (
                    <Utensils className="h-4 w-4" />
                  ) : idx === 1 ? (
                    <Coffee className="h-4 w-4" />
                  ) : idx === 2 ? (
                    <Music className="h-4 w-4" />
                  ) : idx === 3 ? (
                    <Camera className="h-4 w-4" />
                  ) : idx === 4 ? (
                    <Mountain className="h-4 w-4" />
                  ) : (
                    <ShoppingBag className="h-4 w-4" />
                  )}
                  {category}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400">선택한 필터에 맞는 명소가 없습니다.</p>
            <Button
              variant="outline"
              className="mt-4 border-sakura-200 text-sakura-700 hover:bg-sakura-50 dark:border-sakura-900/50 dark:text-sakura-400 dark:hover:bg-sakura-950/30"
              asChild
            >
              <Link href="/local-picks">필터 초기화</Link>
            </Button>
          </div>
        )}

        {filteredLocations.length > 0 && filteredLocations.length < locationData.length && (
          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              className="border-sakura-300 text-sakura-700 hover:bg-sakura-50 dark:border-sakura-700 dark:text-sakura-400 dark:hover:bg-sakura-950/30"
              asChild
            >
              <Link href="/local-picks">모든 명소 보기</Link>
            </Button>
          </div>
        )}

        {filteredLocations.length === locationData.length && (
          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              className="border-sakura-300 text-sakura-700 hover:bg-sakura-50 dark:border-sakura-700 dark:text-sakura-400 dark:hover:bg-sakura-950/30"
            >
              더 보기
            </Button>
          </div>
        )}
      </section>
    </main>
  )
}

interface LocationCardProps {
  location: Location
}

async function LocationCard({ location }: LocationCardProps) {
  // 해당 장소와 관련된 표현들 가져오기
  const relatedPhrases = await getRelatedPhrases(location.id)
  const displayPhrases = relatedPhrases.slice(0, 2) // 최대 2개만 표시

  return (
    <Card className="overflow-hidden group card-hover border-gray-100 dark:border-gray-800">
      <div className="relative h-48">
        <Image
          src={`/placeholder.svg?height=400&width=600&query=${location.imageQuery || location.image || location.name}`}
          alt={location.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex gap-2 mb-2">
            <Badge className="bg-sakura-500 hover:bg-sakura-600">
              {prefectureNameMap[location.prefecture] || location.prefecture}
            </Badge>
            {location.isLocalRecommended && (
              <Badge variant="outline" className="bg-white/10 border-white/30 text-white">
                현지인 추천
              </Badge>
            )}
          </div>
          <h3 className="text-xl font-bold text-white">{location.name}</h3>
          <p className="text-white/80 text-sm">{location.nameJp}</p>
        </div>
      </div>
      <CardContent className="p-4">
        {location.isLocalRecommended && location.localExpert && (
          <div className="flex items-center gap-2 mb-3 text-sm">
            <User className="h-4 w-4 text-sakura-500" />
            <span className="text-gray-700 dark:text-gray-300">{location.localExpert.name} 추천</span>
          </div>
        )}

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm ml-1 text-gray-700 dark:text-gray-300">{location.rating}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm ml-1 text-gray-700 dark:text-gray-300">{location.hours}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{location.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {location.tags.map((tag) => (
            <Link key={tag} href={`/local-picks?tag=${encodeURIComponent(tag.toLowerCase())}`}>
              <Badge
                variant="outline"
                className="text-xs border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-2">
          <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">이 장소에서 사용할 수 있는 표현:</p>
          {displayPhrases.length > 0 ? (
            <ul className="space-y-2">
              {displayPhrases.map((phrase) => (
                <li key={phrase.id} className="flex items-start text-sm">
                  <VolumeUp className="h-4 w-4 mr-2 text-ocean-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{phrase.jp}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">{phrase.kr}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">관련 표현을 준비 중입니다.</p>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-sakura-200 text-sakura-700 hover:bg-sakura-50 dark:border-sakura-900/50 dark:text-sakura-400 dark:hover:bg-sakura-950/30"
          >
            <Link href={`/local-picks/${location.id}`}>
              <MapPin className="h-4 w-4 mr-1" /> 장소 보기
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-ocean-200 text-ocean-700 hover:bg-ocean-50 dark:border-ocean-900/50 dark:text-ocean-400 dark:hover:bg-ocean-950/30"
          >
            <Link href={`/phrases?location=${location.id}`}>
              <VolumeUp className="h-4 w-4 mr-1" /> 표현 배우기
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
