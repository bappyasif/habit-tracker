"use client"

import HabitContextProvider from "@/context-reducers/habitCtxr"
import TrackContextProvider from "@/context-reducers/trackCtx"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // return (
  //   <HabitContextProvider>
  //     <TrackContextProvider Children={Children} />
  //   </HabitContextProvider>
  // )

  // moving this to common navigation group folder layout file so that its carrying same state instances over shared navigation groups
  return <TrackContextProvider children={children} /> 
}
