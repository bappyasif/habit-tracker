"use client"

// import { AppSidebar } from "@/components/app-sidebar-legacy"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import TrackContextProvider from "@/context-reducers/trackCtx"

export default function NestedNavsLayout({ children }: { children: React.ReactNode }) {
    return (
        <TrackContextProvider>
            {/* <SidebarProvider> */}
                <nav className="flex h-screen justify-between">
                    <AppSidebar />
                    {children}
                </nav>
            {/* </SidebarProvider> */}
        </TrackContextProvider>
    )
}
