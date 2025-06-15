"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, MapPin, VolumeIcon as VolumeUp } from "lucide-react"
import { getLocations, type Location } from "@/lib/data-utils"

export default function FeaturedLocations() {
  const [savedLocations, setSavedLocations] = useState<number[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLocations() {
      try {
        const allLocations = await getLocations()
        // 최대 3개의 장소만 표시
        setLocations(allLocations.slice(0, 3))
      } catch (error) {
        console.error("Failed to load locations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLocations()
  }, [])

  const toggleSave = (id: string) => {
    if (savedLocations.includes(Number.parseInt(id))) {
      setSavedLocations(savedLocations.filter((locId) => locId !== Number.parseInt(id)))
    } else {
      setSavedLocations([...savedLocations, Number.parseInt(id)])
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden group card-hover border-gray-100 dark:border-gray-800">
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
        <Card key={location.id} className="overflow-hidden group card-hover border-gray-100 dark:border-gray-800">
          <div className="relative h-48">
            <Image
              src={
                location.image || `/placeholder.svg?height=400&width=600&query=${location.imageQuery || location.name}`
              }
              alt={location.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-2 right-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/30 text-white hover:bg-black/50 hover:text-white"
                onClick={() => toggleSave(location.id)}
              >
                <Bookmark
                  className={`h-5 w-5 ${savedLocations.includes(Number.parseInt(location.id)) ? "fill-white" : ""}`}
                />
              </Button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Badge className="mb-2 bg-sakura-500 hover:bg-sakura-600">{location.region}</Badge>
              <h3 className="text-white font-semibold text-lg">{location.name}</h3>
              <p className="text-white/80 text-sm">{location.nameJp}</p>
            </div>
          </div>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{location.description}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {location.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-2">
              <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                이 장소에서 사용할 수 있는 표현:
              </p>
              <ul className="space-y-2">
                {location.relatedPhraseIds.slice(0, 2).map((phraseId, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <VolumeUp className="h-4 w-4 mr-2 text-ocean-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">일본어 표현 {idx + 1}</span>
                  </li>
                ))}
              </ul>
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
      ))}
    </div>
  )
}
