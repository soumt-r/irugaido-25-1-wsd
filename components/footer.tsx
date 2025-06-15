import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 py-12 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <span className="font-display font-bold text-2xl gradient-text">이루가이도</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400">일본 여행으로 즐겁게 일본어를 배우는 플랫폼입니다.</p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-sakura-100 hover:text-sakura-600 dark:hover:bg-sakura-900/30 dark:hover:text-sakura-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-sakura-100 hover:text-sakura-600 dark:hover:bg-sakura-900/30 dark:hover:text-sakura-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-sakura-100 hover:text-sakura-600 dark:hover:bg-sakura-900/30 dark:hover:text-sakura-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">탐색</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/local-picks"
                  className="text-gray-600 dark:text-gray-400 hover:text-sakura-600 dark:hover:text-sakura-400 transition-colors"
                >
                  로컬 탐색
                </Link>
              </li>
              <li>
                <Link
                  href="/phrases"
                  className="text-gray-600 dark:text-gray-400 hover:text-sakura-600 dark:hover:text-sakura-400 transition-colors"
                >
                  회화 배우기
                </Link>
              </li>
              <li>
                <Link
                  href="/characters"
                  className="text-gray-600 dark:text-gray-400 hover:text-sakura-600 dark:hover:text-sakura-400 transition-colors"
                >
                  문자 학습
                </Link>
              </li>
              <li>
                <Link
                  href="/vocabulary"
                  className="text-gray-600 dark:text-gray-400 hover:text-sakura-600 dark:hover:text-sakura-400 transition-colors"
                >
                  단어장
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">정보</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-sakura-600 dark:hover:text-sakura-400 transition-colors"
                >
                  소개
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-sakura-600 dark:hover:text-sakura-400 transition-colors"
                >
                  문의하기
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-sakura-600 dark:hover:text-sakura-400 transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-sakura-600 dark:hover:text-sakura-400 transition-colors"
                >
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} 이루가이도. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
