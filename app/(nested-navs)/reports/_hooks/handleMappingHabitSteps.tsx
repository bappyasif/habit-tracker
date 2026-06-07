import { useTrackCtx } from "@/context-reducers/trackCtx"

export const useToHandleMappingHabitSteps = () => {
    const { state } = useTrackCtx()
    
     const habit = state.habits.find(habit => Number(habit.id) === state.habitViewing)

    const extractWeekworthOfDailyLogs = () => {
        const dailyLogs = state.dailyLogs.filter(log => log.habitId == state.habitViewing)
        // console.log(dailyLogs, "all daily logs for the habit", state.dailyLogs)
        const last7DaysLogs = dailyLogs.slice(-7)

        return last7DaysLogs
    }

    const mapWeeklyDtaWithHabitData = () => {
        const weekworthOfDailyLogs = extractWeekworthOfDailyLogs()
        const weeklyLogs = weekworthOfDailyLogs.find(log => log.habitId == state.habitViewing)

        // lets recreate Habit data by updating steps data that are found in weekly logs with the completed status from logs
        const mappedHabitSteps = habit?.steps.map(step => {
            const logForStep = weeklyLogs?.logs.find(log => log.log_ids_with_notes.some(logWithNote => logWithNote.id == step.id))
            if (logForStep) {
                return {
                    ...step,
                    completed: logForStep.log_ids_with_notes.length ? true : false
                }
            }
            return step
        })

        // console.log(mappedHabitSteps, "mapped habits with weekly logs")


        // console.log(weeklyLogs, "weekly logs for the habit")

        return mappedHabitSteps
    }

    return {
        mapWeeklyDtaWithHabitData
    }
}