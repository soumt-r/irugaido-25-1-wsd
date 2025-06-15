"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface LocalExpertProps {
  name: string
  nameJp: string
  location: string
  expertise: string[]
  bio: string
  image: string
  recommendations: number
  yearsInJapan: number
}

export default function LocalExpertCard({
  name,
  nameJp,
  location,
  expertise,
  bio,
  image,
  recommendations,
  yearsInJapan,
}: LocalExpertProps) {
  const [showBio, setShowBio] = useState(false)

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            <div className="relative h-48 sm:h-auto sm:w-1/3">
              <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:hidden">
                <h3 className="text-white font-medium">{name}</h3>
              </div>
            </div>
            <div className="p-4 sm:w-2/3">
              <div className="hidden sm:block">
                <h3 className="font-semibold text-lg">{name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{nameJp}</p>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{location}</Badge>
                <span className="text-sm text-muted-foreground">{yearsInJapan}년 거주</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {expertise.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{bio}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-medium">{recommendations}</span> 추천 장소
                </div>
                <Button size="sm" onClick={() => setShowBio(true)}>
                  프로필 보기
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showBio} onOpenChange={setShowBio}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>로컬 전문가 프로필</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-sm text-muted-foreground">{nameJp}</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Badge variant="outline">{location}</Badge>
                <span className="text-sm text-muted-foreground">{yearsInJapan}년 거주</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-1 mb-2">
              {expertise.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-center">{bio}</p>
            <Button className="w-full flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              메시지 보내기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
