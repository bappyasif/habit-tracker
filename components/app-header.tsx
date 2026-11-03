"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"

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
        <div className="flex h-16 items-center justify-center xl:justify-between">
          <div className="flex items-center justify-center xl:justify-between gap-2 font-bold text-base border-b border-border p-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="HabitFlow Logo"
                width={80}
                height={20}
                className="rounded-lg blend-multiply"
              />
              <span className="text-primary text-xl">HabitFlow</span>
            </Link>
          </div>

          <div className="hidden xl:flex items-center gap-4">
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
