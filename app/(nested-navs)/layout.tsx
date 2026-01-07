"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import TrackContextProvider from "@/context-reducers/trackCtx"

export default function NestedNavsLayout({ children }: { children: React.ReactNode }) {
    return (
        <TrackContextProvider>
            <SidebarProvider>
                <AppSidebar />
                {children}
            </SidebarProvider>
        </TrackContextProvider>
    )
}
