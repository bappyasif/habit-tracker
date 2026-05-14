import { useTrackCtx } from "@/context-reducers/trackCtx"
import { LogEntry, LogHistory } from "./log-history"
import { useState } from "react"
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

        return dlog.logs.flatMap((log) => {
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

    const handleUndoLast = () => {
        if (logs.length > 0) {
            setLogs(logs.slice(1))
        }
    }

    return (
        <LogHistory
            logs={pickFive}
            onUndo={handleUndoLast}
            onDelete={(id) => setLogs(logs.filter((l: any) => l.id !== id))}
        />
    )
}