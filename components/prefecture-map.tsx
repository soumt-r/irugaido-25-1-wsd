"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// 일본 도도부현 데이터 (지역별로 그룹화)
const prefecturesByRegion = {
  hokkaido: [
    { id: "hokkaido", name: "홋카이도", nameJp: "北海道", position: "col-start-10 col-span-2 row-start-0 row-span-2" },
  ],
  tohoku: [
    { id: "aomori", name: "아오모리", nameJp: "青森県", position: "col-start-10 col-span-1 row-start-3 row-span-1" },
    { id: "akita", name: "아키타", nameJp: "秋田県", position: "col-start-9 col-span-1 row-start-3 row-span-1" },
    { id: "iwate", name: "이와테", nameJp: "岩手県", position: "col-start-10 col-span-1 row-start-4 row-span-1" },
    { id: "yamagata", name: "야마가타", nameJp: "山形県", position: "col-start-9 col-span-1 row-start-4 row-span-1" },
    { id: "miyagi", name: "미야기", nameJp: "宮城県", position: "col-start-10 col-span-1 row-start-5 row-span-1" },
    { id: "fukushima", name: "후쿠시마", nameJp: "福島県", position: "col-start-9 col-span-1 row-start-5 row-span-1" },
  ],
  kanto: [
    { id: "ibaraki", name: "이바라키", nameJp: "茨城県", position: "col-start-9 col-span-1 row-start-6 row-span-1" },
    { id: "tochigi", name: "도치기", nameJp: "栃木県", position: "col-start-8 col-span-1 row-start-6 row-span-1" },
    { id: "gunma", name: "군마", nameJp: "群馬県", position: "col-start-7 col-span-1 row-start-6 row-span-1" },
    { id: "saitama", name: "사이타마", nameJp: "埼玉県", position: "col-start-8 col-span-1 row-start-7 row-span-1" },
    { id: "chiba", name: "치바", nameJp: "千葉県", position: "col-start-9 col-span-1 row-start-7 row-span-1" },
    { id: "tokyo", name: "도쿄", nameJp: "東京都", position: "col-start-8 col-span-1 row-start-8 row-span-1" },
    { id: "kanagawa", name: "가나가와", nameJp: "神奈川県", position: "col-start-7 col-span-1 row-start-8 row-span-1" },
  ],
  chubu: [
    { id: "niigata", name: "니가타", nameJp: "新潟県", position: "col-start-7 col-span-1 row-start-5 row-span-1" },
    { id: "toyama", name: "도야마", nameJp: "富山県", position: "col-start-6 col-span-1 row-start-5 row-span-1" },
    { id: "ishikawa", name: "이시카와", nameJp: "石川県", position: "col-start-5 col-span-1 row-start-5 row-span-1" },
    { id: "fukui", name: "후쿠이", nameJp: "福井県", position: "col-start-5 col-span-1 row-start-6 row-span-1" },
    { id: "yamanashi", name: "야마나시", nameJp: "山梨県", position: "col-start-7 col-span-1 row-start-7 row-span-1" },
    { id: "nagano", name: "나가노", nameJp: "長野県", position: "col-start-6 col-span-1 row-start-6 row-span-1" },
    { id: "gifu", name: "기후", nameJp: "岐阜県", position: "col-start-6 col-span-1 row-start-7 row-span-1" },
    { id: "shizuoka", name: "시즈오카", nameJp: "静岡県", position: "col-start-7 col-span-1 row-start-9 row-span-1" },
    { id: "aichi", name: "아이치", nameJp: "愛知県", position: "col-start-6 col-span-1 row-start-8 row-span-1" },
  ],
  kinki: [
    { id: "mie", name: "미에", nameJp: "三重県", position: "col-start-5 col-span-1 row-start-8 row-span-1" },
    { id: "shiga", name: "시가", nameJp: "滋賀県", position: "col-start-5 col-span-1 row-start-7 row-span-1" },
    { id: "kyoto", name: "교토", nameJp: "京都府", position: "col-start-4 col-span-1 row-start-7 row-span-1" },
    { id: "osaka", name: "오사카", nameJp: "大阪府", position: "col-start-4 col-span-1 row-start-8 row-span-1" },
    { id: "hyogo", name: "효고", nameJp: "兵庫県", position: "col-start-3 col-span-1 row-start-7 row-span-1" },
    { id: "nara", name: "나라", nameJp: "奈良県", position: "col-start-5 col-span-1 row-start-9 row-span-1" },
    { id: "wakayama", name: "와카야마", nameJp: "和歌山県", position: "col-start-4 col-span-1 row-start-9 row-span-1" },
  ],
  chugoku: [
    { id: "tottori", name: "돗토리", nameJp: "鳥取県", position: "col-start-3 col-span-1 row-start-6 row-span-1" },
    { id: "shimane", name: "시마네", nameJp: "島根県", position: "col-start-2 col-span-1 row-start-6 row-span-1" },
    { id: "okayama", name: "오카야마", nameJp: "岡山県", position: "col-start-3 col-span-1 row-start-8 row-span-1" },
    { id: "hiroshima", name: "히로시마", nameJp: "広島県", position: "col-start-2 col-span-1 row-start-7 row-span-1" },
    { id: "yamaguchi", name: "야마구치", nameJp: "山口県", position: "col-start-1 col-span-1 row-start-7 row-span-1" },
  ],
  shikoku: [
    { id: "tokushima", name: "도쿠시마", nameJp: "徳島県", position: "col-start-4 col-span-1 row-start-10 row-span-1" },
    { id: "kagawa", name: "가가와", nameJp: "香川県", position: "col-start-3 col-span-1 row-start-9 row-span-1" },
    { id: "ehime", name: "에히메", nameJp: "愛媛県", position: "col-start-2 col-span-1 row-start-9 row-span-1" },
    { id: "kochi", name: "고치", nameJp: "高知県", position: "col-start-3 col-span-1 row-start-10 row-span-1" },
  ],
  kyushu: [
    { id: "fukuoka", name: "후쿠오카", nameJp: "福岡県", position: "col-start-1 col-span-1 row-start-8 row-span-1" },
    { id: "saga", name: "사가", nameJp: "佐賀県", position: "col-start-1 col-span-1 row-start-9 row-span-1" },
    { id: "nagasaki", name: "나가사키", nameJp: "長崎県", position: "col-start-1 col-span-1 row-start-10 row-span-1" },
    { id: "kumamoto", name: "구마모토", nameJp: "熊本県", position: "col-start-2 col-span-1 row-start-10 row-span-1" },
    { id: "oita", name: "오이타", nameJp: "大分県", position: "col-start-2 col-span-1 row-start-8 row-span-1" },
    { id: "miyazaki", name: "미야자키", nameJp: "宮崎県", position: "col-start-2 col-span-1 row-start-11 row-span-1" },
    {
      id: "kagoshima",
      name: "가고시마",
      nameJp: "鹿児島県",
      position: "col-start-0 col-span-1 row-start-11 row-span-1",
    },
  ],
  okinawa: [
    { id: "okinawa", name: "오키나와", nameJp: "沖縄県", position: "col-start-0 col-span-1 row-start-13 row-span-1" },
  ],
}

// 지역별 색상 정의
const regionColors = {
  hokkaido: "bg-ocean-400 hover:bg-ocean-500",
  tohoku: "bg-ocean-300 hover:bg-ocean-400",
  kanto: "bg-sakura-300 hover:bg-sakura-400",
  chubu: "bg-sakura-400 hover:bg-sakura-500",
  kinki: "bg-matcha-400 hover:bg-matcha-500",
  chugoku: "bg-matcha-300 hover:bg-matcha-400",
  shikoku: "bg-ocean-300 hover:bg-ocean-400",
  kyushu: "bg-sakura-300 hover:bg-sakura-400",
  okinawa: "bg-matcha-300 hover:bg-matcha-400",
}

// 지역 이름 매핑
const regionNames = {
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

export default function PrefectureMap() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(searchParams.get("prefecture") || null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(searchParams.get("region") || null)

  // URL 쿼리 파라미터로 상태 업데이트
  useEffect(() => {
    const region = searchParams.get("region")
    const prefecture = searchParams.get("prefecture")

    if (region !== selectedRegion) {
      setSelectedRegion(region)
    }

    if (prefecture !== selectedPrefecture) {
      setSelectedPrefecture(prefecture)
    }
  }, [searchParams, selectedRegion, selectedPrefecture])

  const handlePrefectureClick = (prefectureId: string, regionId: string) => {
    // 이미 선택된 도도부현을 다시 클릭하면 선택 해제
    const newPrefecture = selectedPrefecture === prefectureId ? null : prefectureId
    setSelectedPrefecture(newPrefecture)

    // 지역도 함께 업데이트
    const newRegion = newPrefecture ? regionId : null
    setSelectedRegion(newRegion)

    // URL 업데이트
    updateUrl(newRegion, newPrefecture)
  }

  // 지역 클릭 핸들러 추가
  const handleRegionClick = (regionId: string) => {
    // 이미 선택된 지역을 다시 클릭하면 선택 해제
    const newRegion = selectedRegion === regionId ? null : regionId
    setSelectedRegion(newRegion)

    // 도도부현 선택 해제
    setSelectedPrefecture(null)

    // URL 업데이트
    updateUrl(newRegion, null)
  }

  // URL 쿼리 파라미터 업데이트 함수
  const updateUrl = (region: string | null, prefecture: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (region) {
      params.set("region", region)
    } else {
      params.delete("region")
    }

    if (prefecture) {
      params.set("prefecture", prefecture)
    } else {
      params.delete("prefecture")
    }

    // URL 업데이트
    router.push(`/local-picks?${params.toString()}`)
  }

  // 모든 도도부현을 하나의 배열로 합치기
  const allPrefectures = Object.entries(prefecturesByRegion).flatMap(([region, prefectures]) =>
    prefectures.map((prefecture) => ({
      ...prefecture,
      region,
      colorClass: regionColors[region as keyof typeof regionColors],
      regionName: regionNames[region as keyof typeof regionNames],
    })),
  )

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">지역별 탐색</h3>

      {/* 지역 버튼 추가 */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">지역 선택</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(regionNames).map(([regionId, regionName]) => (
            <Button
              key={regionId}
              variant={selectedRegion === regionId ? "default" : "outline"}
              size="sm"
              onClick={() => handleRegionClick(regionId)}
              className={cn(
                selectedRegion === regionId
                  ? "bg-sakura-500 hover:bg-sakura-600 text-white"
                  : "border-sakura-200 text-sakura-700 hover:bg-sakura-50 dark:border-sakura-900/50 dark:text-sakura-400 dark:hover:bg-sakura-950/30",
              )}
            >
              {regionName}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative">
        <TooltipProvider>
          <div className="grid grid-cols-10 grid-rows-13 gap-1 aspect-[4/3] max-w-3xl mx-auto">
            {allPrefectures.map((prefecture) => {
              // 선택된 지역이 있으면 해당 지역의 도도부현만 표시
              const isVisible = !selectedRegion || prefecture.region === selectedRegion

              return (
                <Tooltip key={prefecture.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        prefecture.position,
                        prefecture.colorClass,
                        "h-full w-full p-0 border-2 shadow-sm",
                        selectedPrefecture === prefecture.id && "ring-2 ring-white dark:ring-gray-800 ring-offset-2",
                        !isVisible && "opacity-30",
                      )}
                      onClick={() => handlePrefectureClick(prefecture.id, prefecture.region)}
                    >
                      <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-white drop-shadow-md leading-tight px-0.5">
                        {prefecture.name}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {prefecture.name} ({prefecture.nameJp}) - {prefecture.regionName}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </TooltipProvider>
      </div>

      {(selectedPrefecture || selectedRegion) && (
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedPrefecture(null)
              setSelectedRegion(null)
              router.push("/local-picks")
            }}
            className="border-sakura-200 text-sakura-700 hover:bg-sakura-50 dark:border-sakura-900/50 dark:text-sakura-400 dark:hover:bg-sakura-950/30"
          >
            필터 초기화
          </Button>
        </div>
      )}
    </div>
  )
}
