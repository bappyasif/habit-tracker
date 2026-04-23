import { useTrackCtx } from "@/context-reducers/trackCtx"
import { getHabitDailyTimeline } from "@/server-calls/habits"
import { useEffect } from "react"

export const useToFetchHabitDailyTimeline = async () => {
    const { state, dispatch } = useTrackCtx()
    const habitId = state.habitViewing.toString()

    const fetchTimeline = async () => {
        if (!habitId) return
        const res = await getHabitDailyTimeline(habitId)

        if(res?.data?.daily_tracking_timeline) {
            const modded = res.data.daily_tracking_timeline.map((entry: any) => ({
                dateStamp: entry.date_stamp,
                notes: entry.notes,
                log: entry.completed_steps_ids.map((id: string) => Number(id)) || [],
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