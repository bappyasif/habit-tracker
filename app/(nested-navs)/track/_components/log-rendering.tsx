import { useTrackCtx } from "@/context-reducers/trackCtx"
import { LogEntry, LogHistory } from "./log-history"
import { useState } from "react"
import { mockLogs } from "@/lib/mock-data"

export const LogRendering = ({ habit }: { habit: any }) => {
    const [logs, setLogs] = useState(mockLogs)

    const { state } = useTrackCtx()
    // const { habits } = state
    const { dailyLogs } = state

    // const habit = habits[state.habitViewing - 1]

    console.log(habit, "habit in log rendering")

    if (!habit) {
        return <div>No habit selected</div>
    }

    // let final = []

    // const mappedLogsFromHabit = dailyLogs.map((dlog) => {
    //     let obj_itm = {}
    //     // let final = []
    //     dlog.logs.forEach((log) => {
    //         let obj_itm = {}
    //         console.log(log, "log")
    //         const measurement = habit.measurement.target

    //         log.log_ids_with_notes.forEach((obj) => {
    //             const step = habit.steps.find((step: any) => step.id == obj.id)
    //             const notes = obj.notes || step?.notes || "Not Found"

    //             obj_itm = {
    //                 id: obj.id,
    //                 notes: notes,
    //                 // habitId: dlog.habitId,
    //                 date: new Date(log.date).toISOString(),
    //                 measurement,
    //             }
    //         })
    //         final.push(obj_itm)
    //     })

    //     return obj_itm
    //     // return final
    // })

    const mappedLogsFromHabit = dailyLogs.flatMap((dlog) => {
        const measurement = habit.measurement.target;

        return dlog.logs.flatMap((log) => {
            // const logDate = new Date(log.date).toISOString();
            const logDate = new Date(log.date);

            return log.log_ids_with_notes.map((obj) => {
                const step = habit.steps.find((s: any) => s.id == obj.id);
                const notes = obj.notes || step?.notes || "Not Found";

                return {
                    id: obj.id,
                    notes: notes,
                    date: logDate,
                    measurement: measurement,
                };
            });
        });
    });

    const sortMappedLogs = mappedLogsFromHabit.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const pickFive = sortMappedLogs.slice(0, 5)


    // console.log(mappedLogsFromHabit, "mappedLopgsFromHabit", sortMappedLogs)

    const handleUndoLast = () => {
        if (logs.length > 0) {
            setLogs(logs.slice(1))
        }
    }

    return (
        <LogHistory
            // logs={logs}
            // logs={mappedLogsFromHabit as LogEntry[]}
            // logs={mappedLogsFromHabit as any}
            logs={pickFive}
            onUndo={handleUndoLast}
            onDelete={(id) => setLogs(logs.filter((l: any) => l.id !== id))}
        />
    )
}