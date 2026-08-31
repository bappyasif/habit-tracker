"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, BarChart3, Settings, LogOut, Zap, Home, Notebook } from "lucide-react"
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
    const { dispatch: authDispatch } = useUserAuthCtx()

    if (pathname === "/") return null

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/", redirect: true })
        authDispatch({ type: "SET_UNAUTHENTICATED" })
    }

    const handleNewHabit = () => {
        dispatch({ type: "UPDATE_HABIT_VIEWING", payload: -1 })
    }

    // <FIX> single source of truth for active-route logic, used everywhere
    const isActiveRoute = (href: string) => pathname.startsWith(href)

    const grps = [
        { path: "/", label: "Home", icon: Home, handler: () => router.push("/") },
        { path: "/create-habit", label: "New Habit", icon: Notebook, handler: handleNewHabit },
    ]

    return (
        <div className="flex flex-col h-full w-full xl:w-1/2">
            {/* Logo — always visible */}
            <div className="flex items-center justify-center xl:justify-start gap-2 font-bold text-base border-b border-border p-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary/40 to-secondary/40 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        ✓
                    </div>
                    <span className="text-primary text-xl">HabitFlow</span>
                </Link>
            </div>

            {/* ── MOBILE (< md, ~<768px): fixed bottom tab bar ───────────────── */}
            {/* <FIX> real mobile pattern instead of squeezing labeled nav into a
          narrow column. Icon + tiny label, fixed to viewport bottom, safe
          area aware. Escapes the sidebar's own width constraints entirely. */}
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

            {/* ── TABLET (md–lg, ~768–1024px): icon-only rail ─────────────────── */}
            {/* <FIX> was previously undefined territory (1024-1279 duplicate-render
          bug). Now a distinct, deliberate collapsed state: icons only,
          titles as native tooltips, no wrapping/overflow risk. */}
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

            {/* ── DESKTOP (lg+, ≥1024px): full labeled sidebar ────────────────── */}
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
                    {/* <FIX> single Link, no wrapping onClick div -> no duplicate
              navigate+dispatch race condition */}
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

            {/* Spacer so page content isn't hidden behind the fixed mobile tab bar */}
            {/* <div className="md:hidden h-16 shrink-0" aria-hidden="true" /> */}
        </div>
    )
}