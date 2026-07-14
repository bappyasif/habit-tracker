import { TrackTypes, useTrackCtx } from "@/context-reducers/trackCtx"
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { mockHabits } from "@/lib/mock-data"
import { createHabit, getAllHabits, getUserHabitsFromDb } from "@/server-calls/habits"
import { useEffect } from "react"

export const useToFetchHabits = () => {
    const { state, dispatch } = useTrackCtx()
    const {state: authState} = useUserAuthCtx()

    // const runOnce = () => {
    //     getAllHabits()
    //         .then(payload => {
    //             if (payload?.data?.habits?.length) {
    //                 dispatch({ type: "IINITIALIZE", payload: payload?.data?.habits })
    //                 dispatch({ type: "UPDATE_HABIT_VIEWING", payload: payload?.data?.habits[0]?.id })
    //             } else {
    //                 console.log("no habits found")
    //                 dispatch({ type: "IINITIALIZE", payload: mockHabits })
    //             }
    //         }).catch(err => console.log(err))
    // }

    
    useEffect(() => {
        if (authState.user) {
            console.log(authState.user.id, "authState.user.id", authState, authState?.user?.token)
            getUserHabitsFromDb(authState.user.id, authState?.user?.token!)
                .then(payload => {
                    console.log(payload, "PAYLOAD")
                    if (payload?.data?.habits?.length) {
                        dispatch({ type: "IINITIALIZE", payload: payload?.data?.habits })
                        dispatch({ type: "UPDATE_HABIT_VIEWING", payload: payload?.data?.habits[0]?.id })
                    } else {
                        console.log("no habits found")
                        dispatch({ type: "IINITIALIZE", payload: mockHabits })
                    }
                }).catch(err => console.log(err))
        }
    }, [authState.user])

    // useEffect(() => {
    //     if (state.habitViewing === -1) {
    //         runOnce()
    //     }
    // }, [])
}