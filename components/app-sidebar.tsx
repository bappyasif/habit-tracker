"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, BarChart3, Settings, Plus, LogOut, Zap, Home } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useTrackCtx } from "@/context-reducers/trackCtx"

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/track", label: "Track", icon: Zap },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const { dispatch } = useTrackCtx()

  // Hide sidebar on landing page
  if (pathname === "/") {
    return null
  }

  const handleSignOut = () => {
    router.push("/")
  }

  return (
    <Sidebar className="flex flex-col justify-between h-full bg-red-200">
      <SidebarHeader className="border-b">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-base"
        >
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm">
            ✓
          </div>
          <span className="text-foreground text-2xl">HabitFlow</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex flex-col justify-between overflow-hidden my-6">
        {/* <SidebarGroup className="space-y-3 w-full mx-auto text-center">
          <SidebarGroupContent className="flex flex-col items-center justify-center">
            <SidebarGroupLabel className="">Navigation</SidebarGroupLabel>
          </SidebarGroupContent>
        </SidebarGroup> */}

        {/* <SidebarGroupLabel className=" flex flex-col items-center justify-center text-center">Navigation</SidebarGroupLabel> */}

        <SidebarGroup className="space-y-3">
          <SidebarGroupLabel className="">Navigation</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-0">
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href} className="flex items-center gap-2">
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href} className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        <span className="text-foreground text-xl">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="border-t border-b border-gray-200" />

        <SidebarGroup className="space-y-3">
          <SidebarGroupContent className="space-y-2">
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="font-bold">
                  <Link href="/create-habit" className="flex items-center gap-2 bg-primary/60 text-foreground justify-center" onClick={() => {
                    dispatch({
                      type: 'UPDATE_HABIT_VIEWING',
                      payload: -1
                    })
                    console.log("clicked")
                  }}>
                    <Plus className="w-4 h-4" />
                    <span>New Habit</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="border-t border-b border-gray-200" />
        <SidebarGroup className="space-y-3">
          <SidebarGroupContent className="space-y-2">
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem className="">
                <SidebarMenuButton asChild className="font-semibold">
                  <Link href="/" className="flex items-center gap-2 bg-primary/20 justify-center">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="border-t border-b border-gray-200" />
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} className="cursor-pointer flex items-center gap-2 bg-destructive/10 justify-center font-medium">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
