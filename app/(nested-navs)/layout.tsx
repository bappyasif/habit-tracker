"use client"

import { AppSidebar } from "@/components/app-sidebar"
import TrackContextProvider from "@/context-reducers/trackCtx"
import { useToCheckUserAuthAndRedirect } from "@/hooks/useToCheckUserAuthAndRedirect"

export default function NestedNavsLayout({ children }: { children: React.ReactNode }) {
    useToCheckUserAuthAndRedirect()
    return (
        <TrackContextProvider>
            <nav className="flex flex-col xl:flex-row items-center 2xl:flex-row h-screen justify-between w-full">
                <AppSidebar />
                {children}
            </nav>
        </TrackContextProvider>
    )
}
