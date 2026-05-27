import { useTrackCtx } from "@/context-reducers/trackCtx"
import { LogHistory } from "./log-history"
import { useEffect, useState } from "react"

export const LogRendering = ({ habit }: { habit: any }) => {
    const { state } = useTrackCtx()
    const { dailyLogs } = state

    if (!habit) {
        return <div>No habit selected</div>
    }

    const mappedLogsFromHabit = dailyLogs.flatMap((dlog) => {
        const measurement = habit.measurement.target;

        return dlog.logs.flatMap((log, idx) => {
            const logDate = new Date(log.date);

            return log.log_ids_with_notes.map((obj) => {
                const step = habit.steps.find((s: any) => s.id == obj.id);
                const notes = obj.notes || step?.notes || "Not Found";

                return {
                    id: (idx+1).toString() + obj.id, // add idx to id so that ids are unique as all these logs are based on same step ids so adding index to make them unique to this component
                    notes: notes,
                    date: logDate,
                    measurement: measurement,
                };
            });
        });
    });

    const sortMappedLogs = mappedLogsFromHabit.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const [sortedLogs, setSortedLogs] = useState(sortMappedLogs)

    const pickFive = sortedLogs.slice(0, 5)

    const handleUndoLast = () => {
        if (sortedLogs.length > 0) {
            setSortedLogs(sortedLogs.slice(1))
        }
    }

    useEffect(() => {
        setSortedLogs(sortMappedLogs)
    }, [])

    return (
        <LogHistory
            logs={pickFive}
            onUndo={handleUndoLast}
            onDelete={(id) => setSortedLogs(sortedLogs.filter((l: any) => l.id !== id))}
        />
    )
}