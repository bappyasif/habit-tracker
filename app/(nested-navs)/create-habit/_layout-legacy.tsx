"use client"

import TrackContextProvider from "@/context-reducers/trackCtx";

export default function CreateHabitPageLayout({ children }: { children: React.ReactNode }) {
    // this would create a new instance of this TrackContext but not from already wxisting from other places, thats why we need to keep this into a common groupped folder layout so that it behaves as nested context
    return <TrackContextProvider children={children} />
}