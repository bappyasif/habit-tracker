import { useTrackCtx } from "@/context-reducers/trackCtx"
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { mockHabits } from "@/lib/mock-data"
import { getUserHabitsFromDb } from "@/server-calls/habits"
import { useEffect } from "react"

export const useToFetchHabits = () => {
    const { dispatch } = useTrackCtx()
    const {state: authState} = useUserAuthCtx()
    
    useEffect(() => {
        if (authState.user) {
            getUserHabitsFromDb(authState.user.id, authState?.user?.token!)
                .then(payload => {
                    if (payload?.data?.habits?.length) {
                        dispatch({ type: "IINITIALIZE", payload: payload?.data?.habits })
                        dispatch({ type: "UPDATE_HABIT_VIEWING", payload: payload?.data?.habits[0]?.id })
                    } else {
                        // console.log("no habits found")
                        dispatch({ type: "IINITIALIZE", payload: mockHabits })
                    }
                }).catch(err => console.log(err))
        }
    }, [authState.user])
}