"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// 일본 도도부현 데이터
const prefectures = [
  // 홋카이도 지방
  { id: "hokkaido", name: "홋카이도", nameJp: "北海道", region: "hokkaido" },

  // 도호쿠 지방
  { id: "aomori", name: "아오모리", nameJp: "青森県", region: "tohoku" },
  { id: "iwate", name: "이와테", nameJp: "岩手県", region: "tohoku" },
  { id: "miyagi", name: "미야기", nameJp: "宮城県", region: "tohoku" },
  { id: "akita", name: "아키타", nameJp: "秋田県", region: "tohoku" },
  { id: "yamagata", name: "야마가타", nameJp: "山形県", region: "tohoku" },
  { id: "fukushima", name: "후쿠시마", nameJp: "福島県", region: "tohoku" },

  // 간토 지방
  { id: "ibaraki", name: "이바라키", nameJp: "茨城県", region: "kanto" },
  { id: "tochigi", name: "도치기", nameJp: "栃木県", region: "kanto" },
  { id: "gunma", name: "군마", nameJp: "群馬県", region: "kanto" },
  { id: "saitama", name: "사이타마", nameJp: "埼玉県", region: "kanto" },
  { id: "chiba", name: "치바", nameJp: "千葉県", region: "kanto" },
  { id: "tokyo", name: "도쿄", nameJp: "東京都", region: "kanto" },
  { id: "kanagawa", name: "가나가와", nameJp: "神奈川県", region: "kanto" },

  // 추부 지방
  { id: "niigata", name: "니가타", nameJp: "新潟県", region: "chubu" },
  { id: "toyama", name: "도야마", nameJp: "富山県", region: "chubu" },
  { id: "ishikawa", name: "이시카와", nameJp: "石川県", region: "chubu" },
  { id: "fukui", name: "후쿠이", nameJp: "福井県", region: "chubu" },
  { id: "yamanashi", name: "야마나시", nameJp: "山梨県", region: "chubu" },
  { id: "nagano", name: "나가노", nameJp: "長野県", region: "chubu" },
  { id: "gifu", name: "기후", nameJp: "岐阜県", region: "chubu" },
  { id: "shizuoka", name: "시즈오카", nameJp: "静岡県", region: "chubu" },
  { id: "aichi", name: "아이치", nameJp: "愛知県", region: "chubu" },

  // 긴키 지방
  { id: "mie", name: "미에", nameJp: "三重県", region: "kinki" },
  { id: "shiga", name: "시가", nameJp: "滋賀県", region: "kinki" },
  { id: "kyoto", name: "교토", nameJp: "京都府", region: "kinki" },
  { id: "osaka", name: "오사카", nameJp: "大阪府", region: "kinki" },
  { id: "hyogo", name: "효고", nameJp: "兵庫県", region: "kinki" },
  { id: "nara", name: "나라", nameJp: "奈良県", region: "kinki" },
  { id: "wakayama", name: "와카야마", nameJp: "和歌山県", region: "kinki" },

  // 주고쿠 지방
  { id: "tottori", name: "돗토리", nameJp: "鳥取県", region: "chugoku" },
  { id: "shimane", name: "시마네", nameJp: "島根県", region: "chugoku" },
  { id: "okayama", name: "오카야마", nameJp: "岡山県", region: "chugoku" },
  { id: "hiroshima", name: "히로시마", nameJp: "広島県", region: "chugoku" },
  { id: "yamaguchi", name: "야마구치", nameJp: "山口県", region: "chugoku" },

  // 시코쿠 지방
  { id: "tokushima", name: "도쿠시마", nameJp: "徳島県", region: "shikoku" },
  { id: "kagawa", name: "가가와", nameJp: "香川県", region: "shikoku" },
  { id: "ehime", name: "에히메", nameJp: "愛媛県", region: "shikoku" },
  { id: "kochi", name: "고치", nameJp: "高知県", region: "shikoku" },

  // 규슈 지방
  { id: "fukuoka", name: "후쿠오카", nameJp: "福岡県", region: "kyushu" },
  { id: "saga", name: "사가", nameJp: "佐賀県", region: "kyushu" },
  { id: "nagasaki", name: "나가사키", nameJp: "長崎県", region: "kyushu" },
  { id: "kumamoto", name: "구마모토", nameJp: "熊本県", region: "kyushu" },
  { id: "oita", name: "오이타", nameJp: "大分県", region: "kyushu" },
  { id: "miyazaki", name: "미야자키", nameJp: "宮崎県", region: "kyushu" },
  { id: "kagoshima", name: "가고시마", nameJp: "鹿児島県", region: "kyushu" },

  // 오키나와 지방
  { id: "okinawa", name: "오키나와", nameJp: "沖縄県", region: "okinawa" },
]

// 지방별로 그룹화
const regions = [
  { id: "hokkaido", name: "홋카이도", koreanName: "홋카이도" },
  { id: "tohoku", name: "도호쿠", koreanName: "도호쿠" },
  { id: "kanto", name: "간토", koreanName: "간토" },
  { id: "chubu", name: "추부", koreanName: "추부" },
  { id: "kinki", name: "긴키", koreanName: "긴키" },
  { id: "chugoku", name: "주고쿠", koreanName: "주고쿠" },
  { id: "shikoku", name: "시코쿠", koreanName: "시코쿠" },
  { id: "kyushu", name: "규슈", koreanName: "규슈" },
  { id: "okinawa", name: "오키나와", koreanName: "오키나와" },
]

export default function PrefectureSelector() {
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

  const handleRegionClick = (regionId: string) => {
    const newRegion = selectedRegion === regionId ? null : regionId
    setSelectedRegion(newRegion)

    // 지역이 변경되면 선택된 도도부현 초기화
    setSelectedPrefecture(null)

    // URL 업데이트
    updateUrl(newRegion, null)
  }

  const handlePrefectureClick = (prefectureId: string) => {
    const newPrefecture = selectedPrefecture === prefectureId ? null : prefectureId
    setSelectedPrefecture(newPrefecture)

    // URL 업데이트
    updateUrl(selectedRegion, newPrefecture)
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
    router.push(`?${params.toString()}`)
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">지방</h3>
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <Button
              key={region.id}
              variant={selectedRegion === region.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleRegionClick(region.id)}
              className={cn(
                selectedRegion === region.id
                  ? "bg-sakura-500 hover:bg-sakura-600 text-white"
                  : "border-sakura-200 text-sakura-700 hover:bg-sakura-50 dark:border-sakura-900/50 dark:text-sakura-400 dark:hover:bg-sakura-950/30",
              )}
            >
              {region.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-muted/30">
        <h3 className="text-sm font-medium mb-3">도도부현</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
          <TooltipProvider>
            {prefectures.map((prefecture) => {
              const isVisible = !selectedRegion || prefecture.region === selectedRegion

              return (
                <Tooltip key={prefecture.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "w-10 h-10 rounded-md text-xs font-medium transition-all",
                        selectedPrefecture === prefecture.id
                          ? "bg-sakura-500 text-white border-sakura-500 hover:bg-sakura-600 hover:border-sakura-600"
                          : "border-sakura-200 text-sakura-700 hover:bg-sakura-50 dark:border-sakura-900/50 dark:text-sakura-400 dark:hover:bg-sakura-950/30",
                        !isVisible && "hidden",
                      )}
                      onClick={() => handlePrefectureClick(prefecture.id)}
                    >
                      {prefecture.nameJp.charAt(0)}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {prefecture.name} ({prefecture.nameJp})
                    </p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </div>
      </div>

      {(selectedRegion || selectedPrefecture) && (
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedRegion(null)
              setSelectedPrefecture(null)
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
