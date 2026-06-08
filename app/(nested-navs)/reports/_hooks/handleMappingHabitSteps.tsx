import { useTrackCtx } from "@/context-reducers/trackCtx"

export const useToHandleMappingHabitSteps = () => {
    const { state } = useTrackCtx()

    const habit = state.habits.find(habit => Number(habit.id) === state.habitViewing)

    const extractMonthLongDailyLogs = () => {
        const dailyLogs = state.dailyLogs.filter(log => log.habitId == state.habitViewing)
        // console.log(dailyLogs, "all daily logs for the habit", state.dailyLogs)
        const last30DaysLogs = dailyLogs.slice(-30)

        // console.log(last30DaysLogs, "last 30 days logs for the habit", state.dailyLogs)

        return last30DaysLogs
    }

    const extractWeekworthOfDailyLogs = () => {
        const dailyLogs = state.dailyLogs.filter(log => log.habitId == state.habitViewing)
        // console.log(dailyLogs, "all daily logs for the habit", state.dailyLogs)
        const last7DaysLogs = dailyLogs.slice(-7)

        // console.log(last7DaysLogs, "last 7 days logs for the habit", state.dailyLogs)

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

        console.log(extractedLogs, "extracted logs for the habit based on the extracted daily logs")

        // this needs to be correctly mapped with habit data, currently it only goes through Habit data which is works as a template for this mapping but we need make this Habit Data to be mapped based on each records being extracted
        const mappedHabitSteps = []

        for (let i = 0; i < extractedLogs?.logs.length!; i++) {
            const steps = habit?.steps.map(step => {
                const logForStep = extractedLogs?.logs[i].log_ids_with_notes.find(logWithNote => logWithNote.id == step.id)

                // console.log(logForStep, "log for step", step, extractedLogs?.logs[i])

                return {
                    ...step,
                    completed: logForStep ? true : false,
                    notes: logForStep ? logForStep.notes : "None found: mappedHabitStepsBasedOnExtractedDailyLogs",
                    datestamp: extractedLogs?.logs[i].date,
                    // percentile: extractedLogs?.logs[i].percentile,
                    totalSteps: extractedLogs?.logs[i].totalSteps,
                }
            })

            // console.log(steps, "mapped habit steps for the habit based on the extracted daily logs")
            mappedHabitSteps.push(...steps!)
        }


        // for (let i = 0; i < extractedLogs?.logs.length! - 1; i++) {
        //     const mapped = habit?.steps.map(step => {
        //         const logForStep = extractedLogs?.logs.find(log => log.log_ids_with_notes.some(logWithNote => logWithNote.id == step.id))
        //         if (logForStep) {
        //             return {
        //                 ...step,
        //                 completed: logForStep.log_ids_with_notes.length ? true : false,
        //                 notes: logForStep.notes,
        //                 datestamp: logForStep.date,
        //                 // percentile: logForStep.percentile,
        //                 totalSteps: logForStep.totalSteps,
        //             }
        //         }
        //         return step
        //     })

        //     console.log(mapped, "mapped habit steps for the habit based on the extracted daily logs")

        //     mappedHabitSteps.push(...mapped!)
        // }

        // const mappedHabitSteps = habit?.steps.map(step => {
        //     const logForStep = etractedLogs?.logs.find(log => log.log_ids_with_notes.some(logWithNote => logWithNote.id == step.id))
        //     if (logForStep) {
        //         return {
        //             ...step,
        //             completed: logForStep.log_ids_with_notes.length ? true : false
        //         }
        //     }
        //     return step
        // })

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

    // const mapWeeklyDtaWithHabitData = () => {
    //     const weekworthOfDailyLogs = extractWeekworthOfDailyLogs()
    //     const weeklyLogs = weekworthOfDailyLogs.find(log => log.habitId == state.habitViewing)

    //     // lets recreate Habit data by updating steps data that are found in weekly logs with the completed status from logs
    //     const mappedHabitSteps = habit?.steps.map(step => {
    //         const logForStep = weeklyLogs?.logs.find(log => log.log_ids_with_notes.some(logWithNote => logWithNote.id == step.id))
    //         if (logForStep) {
    //             return {
    //                 ...step,
    //                 completed: logForStep.log_ids_with_notes.length ? true : false
    //             }
    //         }
    //         return step
    //     })

    //     // console.log(mappedHabitSteps, "mapped habits with weekly logs")


    //     // console.log(weeklyLogs, "weekly logs for the habit")

    //     return mappedHabitSteps
    // }

    return {
        mapWeeklyDataWithHabitData,
        mapMonthLongDataWithHabitData
    }
}