import { useTrackCtx } from "@/context-reducers/trackCtx"
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { securelyGetHabitDailyTimeline } from "@/server-calls/habits"
import { useEffect } from "react"

export const useToFetchHabitDailyTimeline = async () => {
    const { state, dispatch } = useTrackCtx()
    const habitId = state.habitViewing.toString()

    const {state: authState} = useUserAuthCtx()

    const fetchTimeline = async () => {
        if (!habitId) return
        const token = authState?.user?.token
        if(!token) return

        const res = await securelyGetHabitDailyTimeline(habitId, token)

        if(res?.data?.daily_tracking_timeline) {
            const modded = res.data.daily_tracking_timeline.map((entry: any) => ({
                dateStamp: entry.date_stamp,
                notes: entry.notes,
                log: entry.steps_completed_with_notes.map((obj: { id: string; notes: string }) => (Number(obj.id))) || [],
                log_ids_with_notes: entry.steps_completed_with_notes.map((obj: { id: string; notes: string }) => ({ id: obj.id, notes: obj.notes })) || [],
                habitId: habitId,
                totalSteps: entry.total_steps,
                percentile: entry.percentile
            }))

            dispatch({ type: "UPDATE_HABIT_DAILY_TIMELINE", payload: modded })
        } 
    }

    useEffect(() => {
        fetchTimeline()
    }, [state.habitViewing])
}