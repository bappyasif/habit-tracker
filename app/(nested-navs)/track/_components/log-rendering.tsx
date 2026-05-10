import { useTrackCtx } from "@/context-reducers/trackCtx"
import { LogEntry, LogHistory } from "./log-history"
import { useState } from "react"
import { mockLogs } from "@/lib/mock-data"

export const LogRendering = ({habit}: {habit: any}) => {
    const [logs, setLogs] = useState(mockLogs)

    const { state } = useTrackCtx()
    // const { habits } = state
    const { dailyLogs } = state

    // const habit = habits[state.habitViewing - 1]

    console.log(habit, "habit in log rendering")

    if(!habit) {
        return <div>No habit selected</div>
    }

    const mappedLogsFromHabit = dailyLogs.map((dlog) => {
        let obj_itm = {}
        dlog.logs.forEach((log) => {
            // console.log(log, "log")
            const measurement = habit.measurement.target

            log.log_ids_with_notes.forEach((obj) => {
                const step = habit.steps.find((step: any) => step.id == obj.id)
                const notes = obj.notes || step?.notes || "Not Found"

                obj_itm = {
                    id: obj.id,
                    notes: notes,
                    // habitId: dlog.habitId,
                    date: new Date(log.date).toISOString(),
                    measurement,
                }
            })
        })

        return obj_itm
    })

    console.log(mappedLogsFromHabit, "mappedLopgsFromHabit")

    const handleUndoLast = () => {
    if (logs.length > 0) {
      setLogs(logs.slice(1))
    }
  }

    return (
        <LogHistory
            // logs={logs}
            logs={mappedLogsFromHabit as LogEntry[]}
            onUndo={handleUndoLast}
            onDelete={(id) => setLogs(logs.filter((l: any) => l.id !== id))}
        />
    )
}