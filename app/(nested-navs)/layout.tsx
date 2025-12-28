"use client"

import HabitContextProvider from "@/context-reducers/habitCtxr"
import TrackContextProvider, { useTrackCtx } from "@/context-reducers/trackCtx"
import { mockHabits } from "@/lib/mock-data"
import { useEffect } from "react"

export default function NestedNavsLayout({ children }: { children: React.ReactNode }) {

//     const { dispatch, state } = useTrackCtx()

//     useEffect(() => {
//     // mockHabits.forEach((habit, idx) => {
//     //   // if(idx > mockHabits.length - 1) return
//     //   // console.log(habit, idx, mockHabits.length, "habit")
//     //   // dispatch({ type: "CREATE_HABIT", payload: habit })
//     // })

//     dispatch({ type: "IINITIALIZE", payload: mockHabits })

//     // setHabits(state.habits)
//   }, [])

    return (
        <TrackContextProvider>
            <HabitContextProvider>
                {children}
            </HabitContextProvider>
        </TrackContextProvider>
    )
    // return (
    //     <HabitContextProvider>
    //         <TrackContextProvider Children={children} />
    //     </HabitContextProvider>
    // )
}
