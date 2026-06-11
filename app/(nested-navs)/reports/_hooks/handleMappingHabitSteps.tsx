import { useTrackCtx } from "@/context-reducers/trackCtx"

export const useToHandleMappingHabitSteps = () => {
    const { state } = useTrackCtx()

    const habit = state.habits.find(habit => Number(habit.id) === state.habitViewing)

    const extractMonthLongDailyLogs = () => {
        const dailyLogs = state.dailyLogs.filter(log => log.habitId == state.habitViewing)

        const last30DaysLogs = dailyLogs.slice(-30)

        return last30DaysLogs
    }

    const extractWeekworthOfDailyLogs = () => {
        const dailyLogs = state.dailyLogs.filter(log => log.habitId == state.habitViewing)

        const last7DaysLogs = dailyLogs.slice(-7)

        return last7DaysLogs
    }

    type ExtractedDailyLog = {
        habitId: string | number;
        logs: {
            ids: string[];
            log_ids_with_notes: {
                id: string;
                notes: string;
            }[];
            date: Date;
            notes: string;
            totalSteps: number;
            percentile: number;
        }[];
    }

    const mappedHabitStepsBasedOnExtractedDailyLogs = (extractedDailyLogs: ExtractedDailyLog[]) => {
        const extractedLogs = extractedDailyLogs.find(log => log.habitId == state.habitViewing)

        // this needs to be correctly mapped with habit data, currently it only goes through Habit data which is works as a template for this mapping but we need make this Habit Data to be mapped based on each records being extracted
        const mappedHabitSteps = []

        for (let i = 0; i < extractedLogs?.logs.length!; i++) {
            const steps = habit?.steps.map(step => {
                const logForStep = extractedLogs?.logs[i].log_ids_with_notes.find(logWithNote => logWithNote.id == step.id)

                return {
                    ...step,
                    completed: logForStep ? true : false,
                    notes: logForStep ? logForStep.notes : "None found: mappedHabitStepsBasedOnExtractedDailyLogs",
                    datestamp: extractedLogs?.logs[i].date,
                    totalSteps: extractedLogs?.logs[i].totalSteps,
                }
            })

            mappedHabitSteps.push(...steps!)
        }

        return mappedHabitSteps
    }

    const mapWeeklyDataWithHabitData = () => {
        const weekworthOfDailyLogs = extractWeekworthOfDailyLogs()

        const mappedHabitSteps = mappedHabitStepsBasedOnExtractedDailyLogs(weekworthOfDailyLogs)

        return mappedHabitSteps
    }

    const mapMonthLongDataWithHabitData = () => {
        const monthLongDailyLogs = extractMonthLongDailyLogs()

        const mappedHabitSteps = mappedHabitStepsBasedOnExtractedDailyLogs(monthLongDailyLogs)

        return mappedHabitSteps
    }

    return {
        mapWeeklyDataWithHabitData,
        mapMonthLongDataWithHabitData
    }
}