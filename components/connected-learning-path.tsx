"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, MessageSquare, BookOpen, ArrowRight, VolumeIcon as VolumeUp } from "lucide-react"

export default function ConnectedLearningPath() {
  const [activeTab, setActiveTab] = useState("place")

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-3">연결된 학습 경로</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          장소, 회화, 단어가 유기적으로 연결되어 실제 여행 상황에 맞는 일본어를 효과적으로 학습할 수 있습니다
        </p>
      </div>

      <Tabs defaultValue="place" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="place" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>장소</span>
          </TabsTrigger>
          <TabsTrigger value="phrases" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>회화</span>
          </TabsTrigger>
          <TabsTrigger value="vocabulary" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>단어</span>
          </TabsTrigger>
        </TabsList>

        <div className="relative">
          <div
            className={`absolute top-1/2 -translate-y-1/2 ${
              activeTab === "place" ? "left-[16.7%]" : activeTab === "phrases" ? "left-[50%]" : "left-[83.3%]"
            } -translate-x-1/2 transition-all duration-300 z-10`}
          >
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              {activeTab === "place" ? "1" : activeTab === "phrases" ? "2" : "3"}
            </div>
          </div>

          <div className="absolute top-1/2 left-[16.7%] right-[16.7%] h-1 bg-muted">
            <div
              className={`h-full bg-primary transition-all duration-300 ${
                activeTab === "place" ? "w-0" : activeTab === "phrases" ? "w-1/2" : "w-full"
              }`}
            ></div>
          </div>

          <TabsContent value="place" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src="https://article-image.travel.navitime.jp/img/NTJtrv1428-ko/00.jpg"
                      alt="츠케지 시장"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent md:bg-gradient-to-r"></div>
                    <div className="absolute bottom-4 left-4 md:left-1/2 md:bottom-1/2 md:translate-y-1/2 md:-translate-x-1/2 text-white z-10">
                      <Badge className="mb-2">도쿄</Badge>
                      <h3 className="text-2xl font-bold mb-1">츠케지 시장</h3>
                      <p className="text-white/80">築地市場</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="bg-primary/10">
                        현지인 추천
                      </Badge>
                      <span className="text-sm text-muted-foreground">사토 유키 추천</span>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      도쿄에서 가장 유명한 생선 시장으로, 현지인들이 아침에 신선한 해산물을 즐기는 곳입니다. 관광객이 잘
                      모르는 숨은 스시집과 해산물 가게가 많습니다.
                    </p>
                    <div className="border-t pt-4 mb-4">
                      <h4 className="font-medium mb-2">이 장소에서 배울 수 있는 표현</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm">
                          <VolumeUp className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                          <span>おまかせでお願いします (오마카세로 부탁드립니다)</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <VolumeUp className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                          <span>これは何ですか (이것은 무엇입니까?)</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/local-picks/2">장소 상세 보기</Link>
                      </Button>
                      <Button size="sm" onClick={() => handleTabChange("phrases")} className="flex items-center gap-1">
                        회화 학습하기
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phrases" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 order-2 md:order-1">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">츠케지 시장 관련 표현</Badge>
                    </div>
                    <div className="space-y-4 mb-6">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-lg">おまかせでお願いします</p>
                            <p className="text-muted-foreground">오마카세로 부탁드립니다</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                            <VolumeUp className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          스시집에서 셰프에게 선택을 맡기고 싶을 때 사용하는 표현입니다.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-lg">これは何ですか</p>
                            <p className="text-muted-foreground">이것은 무엇입니까?</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                            <VolumeUp className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          시장에서 생소한 해산물이나 식품을 보았을 때 물어볼 수 있는 표현입니다.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => handleTabChange("place")}>
                        장소로 돌아가기
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleTabChange("vocabulary")}
                        className="flex items-center gap-1"
                      >
                        관련 단어 학습하기
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative h-64 md:h-auto order-1 md:order-2">
                    <Image
                      src="https://rimage.gnst.jp/livejapan.com/public/article/detail/a/00/00/a0000140/img/basic/a0000140_main.jpg"
                      alt="일본어 회화"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent md:bg-gradient-to-l"></div>
                    <div className="absolute bottom-4 left-4 md:right-4 md:left-auto md:text-right text-white z-10">
                      <Badge className="mb-2">회화 학습</Badge>
                      <h3 className="text-2xl font-bold mb-1">시장에서 사용하는 표현</h3>
                      <p className="text-white/80">市場で使う表現</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vocabulary" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src="https://rimage.gnst.jp/livejapan.com/public/article/detail/a/00/02/a0002910/img/basic/a0002910_main.jpg"
                      alt="일본어 단어장"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent md:bg-gradient-to-r"></div>
                    <div className="absolute bottom-4 left-4 md:left-1/2 md:bottom-1/2 md:translate-y-1/2 md:-translate-x-1/2 text-white z-10">
                      <Badge className="mb-2">단어장</Badge>
                      <h3 className="text-2xl font-bold mb-1">해산물 관련 단어</h3>
                      <p className="text-white/80">魚介類の単語</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">츠케지 시장 관련 단어</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="border rounded-lg p-3">
                        <p className="font-medium">寿司</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">스시</p>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-primary">
                            <VolumeUp className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="border rounded-lg p-3">
                        <p className="font-medium">刺身</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">사시미</p>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-primary">
                            <VolumeUp className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="border rounded-lg p-3">
                        <p className="font-medium">マグロ</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">참치</p>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-primary">
                            <VolumeUp className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="border rounded-lg p-3">
                        <p className="font-medium">サーモン</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">연어</p>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-primary">
                            <VolumeUp className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => handleTabChange("phrases")}>
                        회화로 돌아가기
                      </Button>
                      <Button size="sm" asChild>
                        <Link href="/vocabulary">
                          단어장 더 보기
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
