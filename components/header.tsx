// This component is now deprecated - use AppHeader instead for public pages
// and the sidebar is used for authenticated pages
// Kept for backward compatibility if needed

"use client"

import Link from "next/link"
import { Button } from "./ui/button"

interface HeaderProps {
  showNav?: boolean
}

export function Header({ showNav = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">HabitFlow</span>
          </Link>

          {showNav && (
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition">
                Dashboard
              </Link>
              <Link href="/reports" className="text-sm font-medium hover:text-primary transition">
                Reports
              </Link>
              <Link href="/settings" className="text-sm font-medium hover:text-primary transition">
                Settings
              </Link>
              <Button size="sm" variant="outline">
                Sign In
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
