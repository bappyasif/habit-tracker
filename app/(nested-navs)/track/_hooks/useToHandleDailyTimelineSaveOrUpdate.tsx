import { sendPushNotificationsToUserWhenCompletedHabitSteps, sendPushNotificationsToUserWhenUpdatedHabitSteps } from "@/app/server-actions/notifications"
import { Steps, TrackTypes, useTrackCtx } from "@/context-reducers/trackCtx"
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { securelyCreateHabitDailyTimeline, securelyUpdateHabitDailyTimeline } from "@/server-calls/habits"
import { markAnnouncementIfNeeded } from "@/utils/focus-celebration"
import { useState } from "react"

export const useToHandleDailyTimelineSaveOrUpdate = ({ habit, date, steps, updateSteps }: { habit: TrackTypes, date: Date, steps: Steps[], updateSteps: (ids: (number | string)[]) => void }) => {
    const [isSaving, setIsSaving] = useState(false)

    const { state, dispatch } = useTrackCtx()

    const { state: authState } = useUserAuthCtx()

    const { dailyLogs } = state

    const saveDailyTrackingTodb = async (data: any) => {
        const token = authState?.user?.token!
        const response = await securelyCreateHabitDailyTimeline(data, token)
        return response
    }

    const beginWeeklyCompletionRate = () => {
        const payloadData = {
            habitId: habit.id,
            dateStamp: date,
            data: {
                totalCompleted: habit.steps.map(step => step.completed).filter(step => step).length,
                totalSteps: habit.steps.length,
                percentile: Math.round((habit.steps.map(step => step.completed).filter(step => step).length / habit.steps.length) * 100)
            }
        }

        dispatch({
            type: "SET_A_WEEK_COMPLETION_RATE",
            payload: payloadData
        })
    }

    const updateDailyTimeline = (totalSteps: Steps[], percentile: number) => {
        const tt = {
            habitId: habit.id.toString(),
            dateStamp: date,
            totalSteps: totalSteps.length,
            steps: totalSteps.map(step => ({
                ...step,
                id: step.id.toString()
                // note: "None",
            })),
            completedSteps: totalSteps.filter(step => step.completed).map(step => ({
                ...step,
                id: step.id.toString(),
                // note: "None",
            })),
        }

        const token = authState?.user?.token!

        securelyUpdateHabitDailyTimeline(tt, token)
        .then((resp) => {
            const dataUpdated = resp?.data?.entry?.filter((item: any) => item.habit_id == habit.id && new Date(item.date_stamp).toDateString() == date.toDateString())?.[0] || null

            if (dataUpdated) {
                // lets send a notification to user for updating steps for the habit for today
                sendPushNotificationsToUserWhenUpdatedHabitSteps(authState?.user?.token!)
                
                dispatch({
                    type: "ADJUST_DAILY_TRACKING_LOG",
                    payload: {
                        habitId: habit.id,
                        date: date,
                        log_ids_with_notes: dataUpdated?.steps_completed_with_notes || [],
                        totalSteps: totalSteps.length,
                        percentile: percentile
                    }
                })
            }
        })
    }

    const saveDailyTimelineInDb = (totalSteps: Steps[], percentile: number, completedSteps: Boolean[]) => {
        // save to db for daily tracking as well
        saveDailyTrackingTodb({
            habitId: habit.id.toString(),
            dateStamp: date,
            totalSteps: totalSteps.length,
            steps: totalSteps,
            completedSteps: totalSteps.filter(step => step.completed),
            percentile: percentile,
        }).then((resp) => {
            // problem is here on initial save after loading of today's log it creates a record in db apparently but not sending back a response from server!!
            console.log("saved daily timeline in db and got returned this resp: ", resp)

            // add a notification for step completed successfully
            sendPushNotificationsToUserWhenCompletedHabitSteps(authState?.user?.token!)
        }).catch((err) => {
            console.log("error while saving daily timeline in db: ", err)
        })
    }

    const handleSaveLog = async () => {
        setIsSaving(true)
        // Simulate saving
        // await new Promise((resolve) => setTimeout(resolve, 500))

        // update on daily tracking as well
        beginWeeklyCompletionRate()

        let savedEntry: any = null

        const checkIfHabitStepFoundInDailyLogs = dailyLogs.find((dlog) => {
            const findDate = dlog.logs.find(entry => {
                const logDate = new Date(entry.date).toDateString()
                return logDate === date.toDateString()
            })

            if (findDate) {
                savedEntry = findDate
                updateSteps(findDate.log_ids_with_notes.map((obj: { id: string; notes: string }) => obj.id))
            }

            return findDate
        })

        const totalSteps = steps.map(step => {
            // as we are currently keeping track of completed status in steps themselves, we can directly use that to update the totalSteps for daily timeline instead of mapping through daily logs again to find the completed status for each step as that will be redundant and can cause confusion as well

            return {
                ...step,
                completed: step.completed
            }
        })

        const completedSteps = totalSteps.map(step => step.completed).filter(step => step)
        
        const percentile = Math.round((completedSteps.length / totalSteps.length) * 100)
        
        const isAllDone = totalSteps.length > 0 && completedSteps.length === totalSteps.length

        const wasAllDone = savedEntry?.totalSteps === totalSteps.length && savedEntry?.percentile === percentile

        if (checkIfHabitStepFoundInDailyLogs) {
            // update the existing log in db
            updateDailyTimeline(totalSteps, percentile)
        } else {
            // save to db too
            saveDailyTimelineInDb(totalSteps, percentile, completedSteps)
        }

        // consume util method for announcement
        markAnnouncementIfNeeded({wasAllDone, isAllDone, date})

        // Show success message
        alert("Log saved successfully!")
        setIsSaving(false)
    }

    return { handleSaveLog, isSaving }
}