import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_KR, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import SidebarNav from "@/components/sidebar-nav"
import Footer from "@/components/footer"

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "이루가이도 - 일본 여행과 일본어를 함께 즐기는 방법",
  description: "일본 현지인이 추천하는 숨은 명소와 그곳에서 사용할 수 있는 일본어 표현을 함께 배워보세요.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSans.variable} ${poppins.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen">
            <SidebarNav />
            <div className="flex-1 lg:ml-64">
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
