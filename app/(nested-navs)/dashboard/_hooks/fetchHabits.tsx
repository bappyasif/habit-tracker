import { TrackTypes, useTrackCtx } from "@/context-reducers/trackCtx"
import { createHabit, getAllHabits } from "@/server-calls/habits"
import { useEffect } from "react"

export const useToFetchHabits = () => {
    const { dispatch } = useTrackCtx()

    const runOnce = () => {
        getAllHabits()
            .then(data => {
                console.log(data, "initializing habits from db")
                // normalize data for frontend currently its misisng a few props requires for frontend to render correctly
                // dispatch({ type: "IINITIALIZE", payload: data })
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