import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import "./globals.css"

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
      <body className={`font-sans antialiased`}>
        {/* <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-col flex-1 w-full">
            <AppHeader />
            {children}
          </div>
        </SidebarProvider> */}
        <div className="flex flex-col flex-1 w-full">
          <AppHeader />
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
