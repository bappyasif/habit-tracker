import { useMemo } from "react"
import { useTrackCtx } from "@/context-reducers/trackCtx"

export const useToUpdateHabitStepsCompletion = () => {
  const { state } = useTrackCtx()
  const { habitViewing, dailyLogs } = state

  const habit = state.habits.find((h) => Number(h.id) === Number(habitViewing))

  const updatedHabit = useMemo(() => {
    if (!habit) return undefined

    const today = new Date().toDateString()

    const todaysEntry = dailyLogs
      ?.find((d) => d.habitId == habit.id)
      ?.logs?.find((l) => new Date(l.date).toDateString() === today)

    const completedIds = (todaysEntry?.log_ids_with_notes ?? []).map(
      (o: { id: string | number }) => String(o.id)
    )

    return {
      ...habit,
      steps: habit.steps.map((step) => ({
        ...step,
        completed: completedIds.includes(String(step.id)),
      })),
    }
  }, [habitViewing, dailyLogs, habit])

  return { updatedHabit }
}
