"use client"

import { AppSidebar } from "@/components/app-sidebar"
import TrackContextProvider from "@/context-reducers/trackCtx"

export default function NestedNavsLayout({ children }: { children: React.ReactNode }) {
    return (
        <TrackContextProvider>
            <nav className="flex h-screen justify-between">
                <AppSidebar />
                {children}
            </nav>
        </TrackContextProvider>
    )
}
