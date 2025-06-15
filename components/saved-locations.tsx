"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, VolumeIcon as VolumeUp, X } from "lucide-react"
import { useEffect, useState } from "react"
import { getLocations, type Location } from "@/lib/data-utils"

export default function SavedLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSavedLocations() {
      try {
        // 실제 구현에서는 사용자의 저장된 장소 ID를 가져와서 필터링해야 함
        // 여기서는 예시로 처음 3개의 장소를 "저장된 장소"로 표시
        const allLocations = await getLocations()
        setLocations(allLocations.slice(0, 3))
      } catch (error) {
        console.error("Failed to load saved locations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSavedLocations()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative h-48 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-3 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {locations.map((location) => (
        <Card key={location.id} className="overflow-hidden group">
          <div className="relative h-48">
            <Image
              src={
                location.image || `/placeholder.svg?height=400&width=600&query=${location.imageQuery || location.name}`
              }
              alt={location.name}
              fill
              className="object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <Badge className="mb-2">{location.region}</Badge>
              <h3 className="text-white font-semibold text-lg">{location.name}</h3>
              <p className="text-white/80 text-sm">{location.nameJp}</p>
            </div>
          </div>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-3">{location.description}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {location.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="border-t pt-3 mt-2">
              <p className="text-sm font-medium mb-2">이 장소에서 사용할 수 있는 표현:</p>
              <ul className="space-y-2">
                {location.relatedPhraseIds.slice(0, 2).map((phraseId, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <VolumeUp className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                    <span>일본어 표현 {idx + 1}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/local-picks/${location.id}`}>
                  <MapPin className="h-4 w-4 mr-1" /> 장소 보기
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/phrases?location=${location.id}`}>
                  <VolumeUp className="h-4 w-4 mr-1" /> 표현 배우기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
