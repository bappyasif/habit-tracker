import { TrackTypes } from "@/context-reducers/trackCtx"
import { createHabit, getAllHabits } from "@/server-calls/habits"

export const useToFetchHabits = () => {
    getAllHabits()
    .then(data => {
        console.log(data)
    }).catch(err => console.log(err))

}

// export const useToCreateHabit = (habitData: TrackTypes) => {
//     createHabit(habitData)
//     .then(data => {
//         console.log(data, "created habit")
//     }).catch(err => console.log(err))
// }

// export const useToUpdateHabit = () => {

// }