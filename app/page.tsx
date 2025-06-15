import Link from "next/link"
import HeroSection from "@/components/hero-section"
import ConnectedLearningPath from "@/components/connected-learning-path"
import { Button } from "@/components/ui/button"
import { MapPin, MessageSquare, BookOpen, ArrowRight } from "lucide-react"

export default async function Home() {
  return (
    <main>
      <HeroSection />

      {/* 핵심 기능 소개 */}
      <section className="py-16 px-4 md:px-6 bg-white dark:bg-gray-950">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="gradient-text">일본 여행으로 즐겁게 배우는</span> 일본어
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              여행 계획부터 현지 체험까지, 실제 상황에서 바로 사용할 수 있는 일본어를 배워보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-violet-500/25">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">현지인 추천 명소</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                관광책에 없는 진짜 일본을 경험하고 그곳에서 쓰는 표현을 배워요
              </p>
              <Button variant="outline" asChild className="group-hover:bg-violet-50 border-violet-200 text-violet-700">
                <Link href="/local-picks">
                  명소 탐색하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/25">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">상황별 실전 회화</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                식당, 쇼핑, 교통 등 여행 중 마주치는 실제 상황의 일본어 표현
              </p>
              <Button variant="outline" asChild className="group-hover:bg-indigo-50 border-indigo-200 text-indigo-700">
                <Link href="/phrases">
                  회화 배우기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/25">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">장소별 핵심 단어</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                가고 싶은 장소에서 꼭 필요한 단어들을 미리 익혀두세요
              </p>
              <Button
                variant="outline"
                asChild
                className="group-hover:bg-emerald-50 border-emerald-200 text-emerald-700"
              >
                <Link href="/vocabulary">
                  단어 학습하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 연결된 학습 경로 */}
      <section className="py-16 px-4 md:px-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto">
          <ConnectedLearningPath />
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 px-4 md:px-6 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">지금 바로 시작해보세요!</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">다음 일본 여행이 더욱 특별해질 거예요</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
            >
              <Link href="/local-picks">
                <MapPin className="mr-2 h-5 w-5" />
                명소부터 시작하기
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg border-0"
            >
              <Link href="/phrases">
                <MessageSquare className="mr-2 h-5 w-5" />
                회화부터 시작하기
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
