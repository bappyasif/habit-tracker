"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function AppHeader() {
  const pathname = usePathname()

  // Only show header on landing page (public pages)
  const isPublicPage = pathname === "/"

  if (!isPublicPage) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg gradient-to-br from-blue-600 to-cyan-500 text-primary flex items-center justify-center font-bold">
              ✓
            </div>
            <span className="gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-primary">HabitFlow</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/create-habit">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
