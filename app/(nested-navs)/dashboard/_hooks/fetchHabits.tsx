import { TrackTypes, useTrackCtx } from "@/context-reducers/trackCtx"
import { mockHabits } from "@/lib/mock-data"
import { createHabit, getAllHabits } from "@/server-calls/habits"
import { useEffect } from "react"

export const useToFetchHabits = () => {
    const { dispatch } = useTrackCtx()

    const runOnce = () => {
        getAllHabits()
            .then(payload => {
                console.log(payload, "initializing habits from db", payload?.data?.habits?.length, payload?.data?.habits)
                // normalize data for frontend currently its misisng a few props requires for frontend to render correctly
                // dispatch({ type: "IINITIALIZE", payload: data })
                if(payload?.data?.habits?.length) {
                    console.log("habits found!!")
                    dispatch({ type: "IINITIALIZE", payload: payload?.data?.habits })
                    dispatch({ type: "UPDATE_HABIT_VIEWING", payload: payload?.data?.habits[0]?.id })
                } else {
                    console.log("no habits found")
                    // dispatch({ type: "IINITIALIZE", payload: [] })
                    dispatch({ type: "IINITIALIZE", payload: mockHabits })
                }
            }).catch(err => console.log(err))
    }

    useEffect(() => {
        runOnce()
    }, [])
}

// export const useToCreateHabit = (habitData: TrackTypes) => {
//     createHabit(habitData)
//     .then(data => {
//         console.log(data, "created habit")
//     }).catch(err => console.log(err))
// }

// export const useToUpdateHabit = () => {

// }