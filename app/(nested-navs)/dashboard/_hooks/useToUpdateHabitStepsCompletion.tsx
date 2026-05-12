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

            return {
                ...step,
                completed: sid !== -1 ? true : step.completed
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

    useEffect(() => {
        const today = date.toDateString()

        let findDate = undefined

        dailyLogs.find((dlog) => {
            findDate = dlog.logs.find(entry => {
                const logDate = new Date(entry.date).toDateString()
                return logDate === today
            })

            console.log(findDate, "FOUND date", dlog, "daily log")

            if (findDate?.log_ids_with_notes?.length) {
                updateSteps(findDate.ids)
            } else {
                resetSteps()
            }
            return findDate
        })

        if (!findDate) {
            resetSteps()
        }

    }, [date, dailyLogs])

    const updatedHabit = {
        ...habit,
        steps: steps
    }

    return {updatedHabit}
}