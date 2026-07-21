"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, BarChart3, Settings, LogOut, Zap, Home } from "lucide-react"
import { useTrackCtx } from "@/context-reducers/trackCtx"
import { signOut } from "next-auth/react"
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { Button } from "./ui/button"

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/track", label: "Track", icon: Zap },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
]

export const AppSidebar = () => {
  const pathname = usePathname()
  const router = useRouter()

  const { dispatch } = useTrackCtx()

  const {dispatch: authDispatch} = useUserAuthCtx()

  // Hide sidebar on landing page
  if (pathname === "/") {
    return null
  }

  const handleSignOut = async () => {
    // Trigger signOut and pass the target redirect URL
    await signOut({ 
        callbackUrl: "/", // Tells Auth.js to redirect to home after clearing cookies
        redirect: true    // Ensures a clean, full-page transition
    })
    // now lets clean up user auth state
    authDispatch({ type: "SET_UNAUTHENTICATED" })
  }

  const handleNewHabit = () => {
    dispatch({
      type: 'UPDATE_HABIT_VIEWING',
      payload: -1
    })
  }

  const grps = [
    { path: "/", label: "Home", icon: Home, handler: () => router.push("/") },
    { path: "/create-habit", label: "New Habit", icon: Home, handler: handleNewHabit }
  ]

  return (
    <div className="flex flex-col justify-between h-full p-4">
      <div className="border-b">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-base"
        >
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm">
            ✓
          </div>
          <span className="text-foreground text-2xl">HabitFlow</span>
        </Link>
      </div>

      <div className="flex flex-col justify-between overflow-hidden my-6">
        <div className="space-y-3">
          <div className="space-y-0">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <div key={item.href} className="flex items-center gap-10">
                    <Link href={item.href} className={`flex w-full border-2 items-center gap-2 p-1 px-4 rounded-2xl ${isActive ? "text-primary font-medium bg-primary/60" : "text-foreground"}`}>
                      <item.icon className="w-4 h-4" />
                      <span className="text-foreground text-xl">{item.label}</span>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>

      {
        grps.map((grp) => {
          const isActive = pathname === grp.path
          return (
            (
              <div className="space-y-3" key={grp.path}>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-foreground justify-center">
                      <Link href={grp.path} className={`flex border-2 w-full p-1 px-4 rounded-2xl items-center gap-2 ${isActive ? "font-medium bg-primary/60" : ""}`} onClick={grp.handler}>
                        <grp.icon className="w-4 h-4" />
                        <span className="text-xl ">{grp.label}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        })
      }
      <hr className="border-t border-b border-gray-200" />

      <div className="border-t">
        <div className="space-y-1">
          <div className="flex items-center gap-2 justify-center font-medium">
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              <span className="text-xl">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
