import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MapPin, MessageSquare, Award } from "lucide-react"
import SavedLocations from "@/components/saved-locations"
import SavedPhrases from "@/components/saved-phrases"

export const metadata: Metadata = {
  title: "마이페이지 - 일본 여행 일본어",
  description: "저장한 명소와 표현을 확인하고 학습 진도를 관리하세요.",
}

export default function MyPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-4">마이페이지</h1>
          <p className="text-muted-foreground max-w-2xl">저장한 명소와 표현을 확인하고 학습 진도를 관리하세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                저장한 명소
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">3개 지역</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                저장한 표현
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">24</p>
              <p className="text-sm text-muted-foreground">5개 카테고리</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                학습 진도
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">65%</p>
              <Progress value={65} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="locations" className="mb-8">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="locations">저장한 명소</TabsTrigger>
            <TabsTrigger value="phrases">저장한 표현</TabsTrigger>
            <TabsTrigger value="progress">학습 진도</TabsTrigger>
          </TabsList>
          <TabsContent value="locations" className="mt-6">
            <SavedLocations />
          </TabsContent>
          <TabsContent value="phrases" className="mt-6">
            <SavedPhrases />
          </TabsContent>
          <TabsContent value="progress" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">히라가나 학습</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <span>진행률</span>
                    <span className="font-medium">80%</span>
                  </div>
                  <Progress value={80} className="h-2 mb-4" />
                  <Button variant="outline" size="sm" className="w-full">
                    계속 학습하기
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">가타카나 학습</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <span>진행률</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <Progress value={45} className="h-2 mb-4" />
                  <Button variant="outline" size="sm" className="w-full">
                    계속 학습하기
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">기초 회화</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <span>진행률</span>
                    <span className="font-medium">60%</span>
                  </div>
                  <Progress value={60} className="h-2 mb-4" />
                  <Button variant="outline" size="sm" className="w-full">
                    계속 학습하기
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">단어장 학습</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <span>진행률</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <Progress value={35} className="h-2 mb-4" />
                  <Button variant="outline" size="sm" className="w-full">
                    계속 학습하기
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
