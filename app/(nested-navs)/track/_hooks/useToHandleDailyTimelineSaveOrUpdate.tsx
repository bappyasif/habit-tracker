import { Steps, TrackTypes, useTrackCtx } from "@/context-reducers/trackCtx"
import { createHabitDailyTimeline, createHabitWeeklyTimeline, updateHabitDailyTimeline } from "@/server-calls/habits"
import { useState } from "react"

export const useToHandleDailyTimelineSaveOrUpdate = ({ habit, date, steps, updateSteps }: { habit: TrackTypes, date: Date, steps: Steps[], updateSteps: (ids: (number | string)[]) => void }) => {
    const [isSaving, setIsSaving] = useState(false)
    const { state, dispatch } = useTrackCtx()

    const { dailyLogs } = state
    const saveWeeklyTrackingTodb = async (data: any) => {
        const response = await createHabitWeeklyTimeline(data)
        console.log(response, "response from saving timeline data for weekly tracking")
    }

    const saveDailyTrackingTodb = async (data: any) => {
        const response = await createHabitDailyTimeline(data)
        console.log(response, "response from saving timeline data for daily tracking", data)
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
            // steps: habit.steps.map(step => ({
            //     ...step,
            //     id: step.id.toString()
            //     // note: "None",
            // })),
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
            // completedSteps: habit.steps.filter(step => step.completed).map(step => ({
            //     ...step,
            //     id: step.id.toString(),
            //     // note: "None",
            // })),
        }

        // console.log(tt, "data to update daily timeline for daily tracking", totalSteps)

        updateHabitDailyTimeline(tt).then((resp) => {
            console.log(resp, "response from updating daily timeline data for daily tracking")
            const dataUpdated = resp?.data?.entry?.filter((item: any) => item.habit_id == habit.id && new Date(item.date_stamp).toDateString() == date.toDateString())?.[0] || null

            if (dataUpdated) {
                console.log("dataUpdated for daily timeline", dataUpdated)
                dispatch({
                    type: "TOGGLE_DAILY_TRACKING_LOG",
                    // type: "ADJUST_DAILY_TRACKING_LOG",
                    payload: {
                        habitId: habit.id,
                        date: date,
                        // ids: dataUpdated?.completed_steps_ids || [],
                        log_ids_with_notes: dataUpdated?.steps_completed_with_notes || [],
                        totalSteps: totalSteps.length,
                        percentile: percentile
                    }
                })
            }
        })
    }

    const saveDailyTimelineInDb = (totalSteps: Steps[], percentile: number, completedSteps: Boolean[]) => {
        const dbrq = {
            habitId: habit.id,
            week: {
                weekStart: new Date(date.getTime() - (date.getDay() - 1) * 24 * 60 * 60 * 1000),
                weekEnd: new Date(date.getTime() + (6 - date.getDay()) * 24 * 60 * 60 * 1000),
                totalCompleted: completedSteps.length,
                totalSteps: totalSteps.length,
                percentile: percentile
            }
        }

        // saveTodb(dbrq)
        saveWeeklyTrackingTodb(dbrq)

        // save to db for daily tracking as well
        saveDailyTrackingTodb({
            habitId: habit.id.toString(),
            dateStamp: date,
            totalSteps: totalSteps.length,
            steps: habit.steps.map(step => ({
                ...step,
                id: step.id.toString(),
                notes: step.notes || "None found from fe",
                // notes: stepNotes?.stepId == step.id ? stepNotes?.notes : "None found from fe",
            })),
            completedSteps: habit.steps.filter(step => step.completed).map(step => ({
                ...step,
                id: step.id.toString(),
                notes: step.notes || "None found from fe",
                // notes: stepNotes?.stepId == step.id ? stepNotes?.notes : "None found from fe",
                // note: "None",
            })),
            // notes: "consider adding notes input in the UI for each day to log any specific notes for that day along with steps and measurement"
        })
    }

    // const updateSteps = (ids: (number | string)[]) => {
    //     const tempSteps = steps.map(step => {
    //         const sid = ids?.findIndex(v => v == step.id && step.datestamp == date.toDateString())

    //         return {
    //             ...step,
    //             completed: sid !== -1 ? true : step.completed
    //         }
    //     })

    //     setSteps(tempSteps)
    // }

    // const resetSteps = () => {
    //   const todaySteps = habit.steps.map(step => {
    //     return {
    //       ...step,
    //       completed: false,
    //     }
    //   })
    //   setSteps(todaySteps)
    // }

    const handleSaveLog = async () => {
        setIsSaving(true)
        // Simulate saving
        await new Promise((resolve) => setTimeout(resolve, 500))

        habit.steps = steps
        // as im considering update to be unchanged in reducers states and only updating in track from daily logs data so keeping it unchanged 
        // dispatch({
        //   type: 'UPDATE_HABIT',
        //   payload: habit
        // })

        // update on daily tracking as well
        beginWeeklyCompletionRate()

        const checkIfHabitStepFoundInDailyLogs = dailyLogs.find((dlog) => {
            const findDate = dlog.logs.find(entry => {
                const logDate = new Date(entry.date).toDateString()
                return logDate === date.toDateString()
            })

            if (findDate) {
                updateSteps(findDate.ids)
            }
            return findDate
        })

        // const completedSteps = habit.steps.map(step => step.completed).filter(step => step)
        // const totalSteps = habit.steps
        // habit steps needs to be mapped with dailyLogs to get the accurate completed and total steps for that day as user can update the daily logs for any day and that should reflect in the completion percentage for that day in weekly tracking as well
        const totalSteps = habit.steps.map(step => {
            const findInDailyLogs = checkIfHabitStepFoundInDailyLogs?.logs.map((log) => new Date(log.date).toDateString() == date.toDateString() ? log.ids : []).flat().find((id: string) => id == step.id)
            // .flat().find((id: string) => id == step.id)
            console.log(findInDailyLogs, "findInDailyLogs for step", step.id, "step id")
            return {
                ...step,
                completed: findInDailyLogs ? false : true
            }
        })

        const completedSteps = totalSteps.map(step => step.completed).filter(step => step)
        
        const percentile = Math.round((completedSteps.length / totalSteps.length) * 100)

        console.log(checkIfHabitStepFoundInDailyLogs, "checkIfHabitStepFoundInDailyLogs", date, "date",)

        if (checkIfHabitStepFoundInDailyLogs) {
            // update the existing log in db
            updateDailyTimeline(totalSteps, percentile)
        } else {
            // save to db too
            saveDailyTimelineInDb(totalSteps, percentile, completedSteps)
        }

        // Show success message
        alert("Log saved successfully!")
        setIsSaving(false)
    }

    return { handleSaveLog, isSaving }
}