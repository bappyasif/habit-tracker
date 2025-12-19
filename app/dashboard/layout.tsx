"use client"

import TrackContextProvider from "@/context-reducers/trackCtx"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <TrackContextProvider Children={children} /> 
}
