"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Sun, Moon, MapPin, MessageSquare, BookOpen, User } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navItems = [
    { name: "홈", href: "/" },
    { name: "로컬 탐색", href: "/local-picks", icon: <MapPin className="h-5 w-5 mr-2" /> },
    { name: "회화 배우기", href: "/phrases", icon: <MessageSquare className="h-5 w-5 mr-2" /> },
    { name: "문자 학습", href: "/characters", icon: <BookOpen className="h-5 w-5 mr-2" /> },
    { name: "단어장", href: "/vocabulary", icon: <BookOpen className="h-5 w-5 mr-2" /> },
    { name: "마이페이지", href: "/mypage", icon: <User className="h-5 w-5 mr-2" /> },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="메뉴 열기">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex items-center mb-8 mt-4">
                <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                  <span className="font-display font-bold text-2xl gradient-text">이루가이도</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-2 py-3 text-lg hover:bg-accent rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display font-bold text-2xl gradient-text">이루가이도</span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="테마 변경" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button variant="outline" size="sm" asChild className="hidden sm:flex">
            <Link href="/login">로그인</Link>
          </Button>

          <Button
            size="sm"
            asChild
            className="bg-gradient-to-r from-sakura-500 to-sakura-600 hover:from-sakura-600 hover:to-sakura-700"
          >
            <Link href="/signup">회원가입</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
