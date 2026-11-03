"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, BarChart3, Settings, LogOut, Zap, Home, Notebook } from "lucide-react"
import { useTrackCtx } from "@/context-reducers/trackCtx"
import { signOut } from "next-auth/react"
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { Button } from "./ui/button"
import Image from "next/image"

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
    const { dispatch: authDispatch } = useUserAuthCtx()

    if (pathname === "/") return null

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/", redirect: true })
        authDispatch({ type: "SET_UNAUTHENTICATED" })
    }

    const handleNewHabit = () => {
        dispatch({ type: "UPDATE_HABIT_VIEWING", payload: -1 })
    }

    const isActiveRoute = (href: string) => pathname.startsWith(href)

    const grps = [
        { path: "/", label: "Home", icon: Home, handler: () => router.push("/") },
        { path: "/create-habit", label: "New Habit", icon: Notebook, handler: handleNewHabit },
    ]

    return (
        <div className="flex flex-col h-full w-full xl:w-1/4">
            {/* Logo — always visible */}
            <div className="flex items-center justify-center xl:justify-start gap-2 font-bold text-base border-b border-border p-4">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="HabitFlow Logo"
                        width={80}
                        height={20}
                        className="rounded-lg"
                    />
                    <span className="text-primary text-xl">HabitFlow</span>
                </Link>
            </div>

            <nav
                aria-label="Primary"
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch justify-around
                   bg-card border-t border-border pb-[env(safe-area-inset-bottom)]"
            >
                {navigationItems.map((item) => {
                    const active = isActiveRoute(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs
                ${active ? "text-primary font-medium" : "text-muted-foreground"}`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <nav aria-label="Primary" className="hidden md:flex xl:hidden items-center justify-center gap-2 py-4">
                <div className="mt-auto flex items-center justify-center gap-2 pb-4 border-b border-border w-full">
                    {navigationItems.map((item) => {
                        const active = isActiveRoute(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={item.label}
                                aria-current={active ? "page" : undefined}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center
                ${active ? "bg-primary/15 text-primary" : "text-foreground hover:bg-muted"}`}
                            >
                                <item.icon className="w-5 h-5" />
                            </Link>
                        )
                    })}
                </div>

                <div className="mt-auto flex justify-center items-center gap-2 pb-4 border-b border-border w-full">
                    {grps.map((grp) => (
                        <button
                            key={grp.path}
                            title={grp.label}
                            onClick={grp.handler}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center
                ${pathname === grp.path ? "bg-primary/15 text-primary" : "text-foreground hover:bg-muted"}`}
                        >
                            <grp.icon className="w-5 h-5" />
                        </button>
                    ))}
                    <Button
                        variant="destructive"
                        size="icon"
                        title="Sign Out"
                        onClick={handleSignOut}
                        className="w-10 h-10 rounded-xl"
                    >
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </nav>

            <nav aria-label="Primary" className="hidden xl:flex flex-col justify-around flex-1 overflow-hidden p-4">
                <div className="space-y-1 h-2/3 flex flex-col justify-center">
                    {navigationItems.map((item) => {
                        const active = isActiveRoute(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-colors
                  ${active ? "text-primary font-medium bg-primary/15" : "text-foreground hover:bg-muted"}`}
                            >
                                <item.icon className="w-4 h-4 shrink-0" />
                                <span className="text-base">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>

                <div className="space-y-1 pt-4 border-t border-border flex flex-col justify-center h-1/3">
                    {grps.map((grp) => {
                        const active = pathname === grp.path
                        return (
                            <Link
                                key={grp.path}
                                href={grp.path}
                                onClick={grp.handler}
                                className={`flex items-center gap-3 px-4 py-2 rounded-2xl
                  ${active ? "font-medium bg-primary/15 text-primary" : "text-foreground hover:bg-muted"}`}
                            >
                                <grp.icon className="w-4 h-4 shrink-0" />
                                <span className="text-base">{grp.label}</span>
                            </Link>
                        )
                    })}

                    <Button
                        variant="destructive"
                        onClick={handleSignOut}
                        className="w-full justify-start gap-2 mt-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </Button>
                </div>
            </nav>
        </div>
    )
}