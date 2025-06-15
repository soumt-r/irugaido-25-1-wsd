"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, MapPin, MessageSquare, BookOpen, User, Sun, Moon, Menu, X, LogIn, UserPlus } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

export default function SidebarNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  // 모바일에서 사이드바 열었을 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const navItems: NavItem[] = [
    { name: "홈", href: "/", icon: <Home className="h-5 w-5" /> },
    { name: "로컬 탐색", href: "/local-picks", icon: <MapPin className="h-5 w-5" /> },
    { name: "회화 배우기", href: "/phrases", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "문자 학습", href: "/characters", icon: <BookOpen className="h-5 w-5" /> },
    { name: "단어장", href: "/vocabulary", icon: <BookOpen className="h-5 w-5" /> },
    { name: "마이페이지", href: "/mypage", icon: <User className="h-5 w-5" /> },
  ]

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <>
      {/* 모바일 햄버거 메뉴 버튼 */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          aria-label="메뉴 열기"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-background/80 backdrop-blur-sm border shadow-sm"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* 로고 (모바일) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <Link href="/" className="flex items-center">
          <span className="font-display font-bold text-xl gradient-text">이루가이도</span>
        </Link>
      </div>

      {/* 오버레이 (모바일) */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)}></div>}

      {/* 사이드바 */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-40 bg-background border-r transition-transform duration-300 w-64",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* 로고 */}
          <div className="flex items-center mb-8 mt-4">
            <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
              <span className="font-display font-bold text-2xl gradient-text">이루가이도</span>
            </Link>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="flex flex-col gap-2 flex-grow">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href
                      ? "bg-sakura-100 text-sakura-700 hover:bg-sakura-200 hover:text-sakura-800 dark:bg-sakura-900/20 dark:text-sakura-400 dark:hover:bg-sakura-900/30"
                      : "",
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          {/* 하단 버튼 */}
          <div className="mt-auto pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" aria-label="테마 변경" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <LogIn className="h-4 w-4 mr-1" />
                    로그인
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-sakura-500 to-sakura-600 hover:from-sakura-600 hover:to-sakura-700"
                  asChild
                >
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <UserPlus className="h-4 w-4 mr-1" />
                    가입
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
