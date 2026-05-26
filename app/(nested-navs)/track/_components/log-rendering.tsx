import { useTrackCtx } from "@/context-reducers/trackCtx"
import { LogEntry, LogHistory } from "./log-history"
import { useEffect, useState } from "react"
import { mockLogs } from "@/lib/mock-data"

export const LogRendering = ({ habit }: { habit: any }) => {
    const [logs, setLogs] = useState(mockLogs)

    const { state } = useTrackCtx()

    const { dailyLogs } = state

    if (!habit) {
        return <div>No habit selected</div>
    }

    const mappedLogsFromHabit = dailyLogs.flatMap((dlog) => {
        const measurement = habit.measurement.target;

        // console.log("dlog: ", dlog)

        return dlog.logs.flatMap((log, idx) => {
            const logDate = new Date(log.date);

            // console.log("logDate: ", log)

            return log.log_ids_with_notes.map((obj) => {
                const step = habit.steps.find((s: any) => s.id == obj.id);
                const notes = obj.notes || step?.notes || "Not Found";

                return {
                    // id: obj.id,
                    // id: obj.id + idx,
                    // id: idx.toString(),
                    // id: step.idx,
                    id: (idx+1).toString() + obj.id, // add idx to id so that ids are unique as all these logs are based on same step ids so adding index to make them unique to this component
                    notes: notes,
                    date: logDate,
                    measurement: measurement,
                };
            });
        });
    });

    const sortMappedLogs = mappedLogsFromHabit.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // const pickFive = sortMappedLogs.slice(0, 5)

    const handleUndoLast = () => {
        if (logs.length > 0) {
            setLogs(logs.slice(1))
        }
    }

    const [sortedLogs, setSortedLogs] = useState(sortMappedLogs)

    // const [pick5, setPick5] = useState(sortedLogs.slice(0, 5))

    const pickFive = sortedLogs.slice(0, 5)

    useEffect(() => {
        setSortedLogs(sortMappedLogs)
    }, [])

    // useEffect(() => {
    //     setPick5(sortedLogs.slice(0, 5))
    // }, [sortedLogs])

    // console.log(dailyLogs, "daily logs")

    // console.log("sortedLogs: ", sortedLogs)

    return (
        <LogHistory
            // logs={pickFive}
            // logs={sortedLogs.slice(0, 5)}
            logs={pickFive}
            onUndo={handleUndoLast}
            // onDelete={(id) => setLogs(logs.filter((l: any) => l.id !== id))}
            onDelete={(id) => setSortedLogs(sortedLogs.filter((l: any) => l.id !== id))}
        />
    )
}