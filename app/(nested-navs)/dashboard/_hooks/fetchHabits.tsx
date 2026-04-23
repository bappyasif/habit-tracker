import { TrackTypes, useTrackCtx } from "@/context-reducers/trackCtx"
import { mockHabits } from "@/lib/mock-data"
import { createHabit, getAllHabits } from "@/server-calls/habits"
import { useEffect } from "react"

export const useToFetchHabits = () => {
    const { state, dispatch } = useTrackCtx()

    const runOnce = () => {
        getAllHabits()
            .then(payload => {
                console.log(payload, "payload")
                if (payload?.data?.habits?.length) {
                    dispatch({ type: "IINITIALIZE", payload: payload?.data?.habits })
                    dispatch({ type: "UPDATE_HABIT_VIEWING", payload: payload?.data?.habits[0]?.id })
                } else {
                    console.log("no habits found")
                    dispatch({ type: "IINITIALIZE", payload: mockHabits })
                }
            }).catch(err => console.log(err))
    }

    useEffect(() => {
        if (state.habitViewing === -1) {
            runOnce()
        }
    }, [])
}