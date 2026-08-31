"use client"

import { AppSidebar } from "@/components/app-sidebar"
import TrackContextProvider from "@/context-reducers/trackCtx"
import { useToCheckUserAuthAndRedirect } from "@/hooks/useToCheckUserAuthAndRedirect"

export default function NestedNavsLayout({ children }: { children: React.ReactNode }) {
    useToCheckUserAuthAndRedirect()
    return (
        <TrackContextProvider>
            <nav className="flex flex-col items-center lg:flex-row h-screen justify-between sm:w-1/2 md:w-full">
                <AppSidebar />
                {children}
            </nav>
        </TrackContextProvider>
    )
}
