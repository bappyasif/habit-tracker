import { useTrackCtx } from "@/context-reducers/trackCtx"
import { useEffect, useState } from "react"

export const useToUpdateHabitStepsCompletion = () => {
    const { state, dispatch } = useTrackCtx()
    const { habitViewing, dailyLogs } = state

    const habit = state.habits.find(habit => Number(habit.id) === habitViewing)

    const [date, setDate] = useState(new Date())
    const [steps, setSteps] = useState(habit?.steps || [])

    const updateSteps = (ids: (number | string)[]) => {
        const tempSteps = steps.map(step => {
            const sid = ids?.findIndex(v => v == step.id)

            const notesFromDailyLog = dailyLogs?.find(dlog => dlog.habitId == habit?.id)?.logs?.find(log => new Date(log.date).toDateString() == date.toDateString())?.log_ids_with_notes?.find((obj: { id: string; notes: string }) => obj.id == step.id)?.notes

            return {
                ...step,
                completed: sid !== -1 ? true : step.completed,
                notes: notesFromDailyLog || step.notes || "None found: useToUpdateHabitStepsCompletion"
            }
        })

        setSteps(tempSteps)
    }

    const resetSteps = () => {
        const todaySteps = habit?.steps.map(step => {
            return {
                ...step,
                completed: false,
            }
        })
        if (todaySteps) {
            setSteps(todaySteps)
        }
    }

    const updateOrReset = () => {
        const today = date.toDateString()

        let findDate = undefined

        dailyLogs.find((dlog) => {
            findDate = dlog.logs.find(entry => {
                const logDate = new Date(entry.date).toDateString()
                return logDate === today
            })

            if (findDate?.log_ids_with_notes?.length) {
                updateSteps(findDate.log_ids_with_notes.map((obj: { id: string; notes: string }) => obj.id))
            } else {
                resetSteps()
            }
            return findDate
        })

        if (!findDate) {
            resetSteps()
        }
    }

    useEffect(() => {
        updateOrReset()

    }, [date, dailyLogs])

    const [updatedHabit, setUpdatedHabit] = useState({
        ...habit,
        steps: steps
    })

    useEffect(() => {
        setUpdatedHabit({
            ...habit,
            steps: steps
        })
    }, [steps, habit])

    return {updatedHabit}
}