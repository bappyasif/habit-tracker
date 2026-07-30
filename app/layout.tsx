import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AppHeader } from "@/components/app-header"
import "./globals.css"
import { WrapperContextProviders } from "@/components/WrapperContextProviders"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HabitFlow - AI-Powered Habit Tracking in Bangla & English",
  description:
    "Track habits with personalized AI coaching. Build better habits with daily guidance and weekly insights.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased flex h-screen bg-background text-foreground ${_geist.className} ${_geistMono.className}`}>
        <div className="flex flex-col flex-1 w-full">
          <WrapperContextProviders>
            <AppHeader />
            {children}
          </WrapperContextProviders>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
