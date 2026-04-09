import { useTrackCtx } from "@/context-reducers/trackCtx"
import { getHabitDailyTimeline } from "@/server-calls/habits"
import { useEffect } from "react"

export const useToFetchHabitDailyTimeline = async () => {
    const { state, dispatch } = useTrackCtx()
    const habitId = state.habitViewing.toString()

    const fetchTimeline = async () => {
        if (!habitId) return
        const res = await getHabitDailyTimeline(habitId)
        console.log(res, "fetched habit daily timeline")
        if(res?.data?.daily_tracking_timeline) {
            dispatch({ type: "UPDATE_HABIT_DAILY_TIMELINE", payload: {
                    habitId: habitId,
                    log: res?.data?.daily_tracking_timeline[0]?.completed_steps_ids.map((id: string) => Number(id)) || [],
                    dateStamp: res?.data?.daily_tracking_timeline[0]?.date_stamp || ""
            } })
        } else {
            dispatch({ type: "UPDATE_HABIT_DAILY_TIMELINE", payload: [] })
        }
    }

    // useEffect(() => {
    //     if (!habitId) return
    //     fetchTimeline()
    // }, [state])

    useEffect(() => {
        fetchTimeline()
    }, [state.habitViewing])

    // useEffect(() => {
    //     fetchTimeline()
    // }, [])
}