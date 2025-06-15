"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, MessageSquare, ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 japanese-pattern opacity-30"></div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-full mb-6">
              <span className="text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                ✈️ 일본 여행 × 일본어 학습
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
              <span className="gradient-text">여행으로</span>
              <br />
              <span className="text-gray-900 dark:text-white">배우는</span>
              <br />
              <span className="gradient-text">일본어</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300 leading-relaxed">
              현지인이 추천하는 숨은 명소와
              <br />
              그곳에서 바로 쓸 수 있는 일본어를
              <br />
              <strong className="text-violet-600">함께 배워보세요</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium text-lg px-8 py-4 h-auto shadow-lg shadow-violet-500/25"
                asChild
              >
                <Link href="/local-picks">
                  <MapPin className="mr-2 h-5 w-5" />
                  명소 탐색하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-950/30 text-lg px-8 py-4 h-auto"
                asChild
              >
                <Link href="/phrases">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  회화 배우기
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                <span>현지인 추천 명소</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span>실전 회화 표현</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>장소별 단어장</span>
              </div>
            </div>
          </div>

          <div
            className={`relative transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="relative h-[500px] w-full">
              {/* 메인 이미지 */}
              <div className="absolute top-0 right-0 w-[85%] h-[75%] bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-900/30 dark:to-purple-800/30 rounded-3xl overflow-hidden shadow-2xl animate-float">
                <Image src="https://www.datocms-assets.com/101439/1702826688-night-scene-of-shinjuku-golden-gai.webp?auto=format&h=1000&w=2000" alt="도쿄 거리" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-lg font-bold">도쿄 골든가이</p>
                  <p className="text-sm opacity-90">현지인이 추천하는 숨은 명소</p>
                </div>
              </div>

              {/* 회화 카드 */}
              <div
                className="absolute bottom-0 left-0 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl animate-float border border-gray-100 dark:border-gray-700 max-w-[280px]"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">술집에서</p>
                    <p className="text-xs text-gray-500">바로 쓸 수 있는 표현</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-lg">すみません、おすすめは？</p>
                  <p className="text-gray-600 dark:text-gray-400">실례합니다, 추천 메뉴가 뭔가요?</p>
                </div>
                <Button size="sm" className="w-full mt-3 bg-indigo-500 hover:bg-indigo-600">
                  <Play className="mr-2 h-3 w-3" />
                  발음 듣기
                </Button>
              </div>

              {/* 단어 카드 */}
              <div
                className="absolute top-[20%] left-[10%] bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg animate-float border border-gray-100 dark:border-gray-700"
                style={{ animationDelay: "2s" }}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold mb-1">居酒屋</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">이자카야</p>
                  <div className="w-8 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mx-auto mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 웨이브 디바이더 */}
      <div className="wave-divider">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
          className="text-white dark:text-gray-950"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  )
}
