"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/app/(nested-navs)/track/_components/date-picker"
import { StepLogger } from "@/app/(nested-navs)/track/_components/step-logger"
import { MeasurementInput } from "@/app/(nested-navs)/track/_components/measurement-input"
import { Save } from "lucide-react"
import { useTrackCtx } from "@/context-reducers/trackCtx"
import { LogRendering } from "./_components/log-rendering"
import { useToHandleDailyTimelineSaveOrUpdate } from "./_hooks/useToHandleDailyTimelineSaveOrUpdate"
import { WhenNoHabitIsCreated } from "@/components/WhenNoHabitIsCreated"

export default function TrackPage() {
  const { state } = useTrackCtx()

  const habit = state.habits.find((habit) => Number(habit.id) == state.habitViewing)

  if (!habit) {
    return <WhenNoHabitIsCreated />
  }

  const [date, setDate] = useState(new Date())
  const [measurementValue, setMeasurementValue] = useState(habit.measurement.target)
  const backup = habit?.steps.map(step => ({
    ...step,
    notes: step.notes ?? "initial state from backup"
  })) || []

  const [steps, setSteps] = useState(backup)

  const { dailyLogs } = state

  const updateSteps = (ids: (number | string)[]) => {
    const tempSteps = backup.map(step => {
      const sid = ids?.findIndex(v => v == step.id)
      
      const notesFromDailyLog = dailyLogs?.find(dlog => dlog.habitId == habit.id)?.logs?.find(log => new Date(log.date).toDateString() == date.toDateString())?.log_ids_with_notes?.find((obj: { id: string; notes: string }) => obj.id == step.id)?.notes

      return {
        ...step,
        completed: sid !== -1 ? true : false,
        notes: notesFromDailyLog || step.notes || "None found: track page"
      }
    })

    setSteps(tempSteps)
  }

  const resetSteps = () => {
    const todaySteps = backup.map(step => {
      return {
        ...step,
        completed: false,
        notes: "resetted for notes: track page"
      }
    })
    setSteps(todaySteps)
  }

  const { handleSaveLog, isSaving } = useToHandleDailyTimelineSaveOrUpdate({ habit, date, steps, updateSteps })

  // update steps completion based on daily logs for the selected date
  useEffect(() => {
    const today = date.toDateString()

    let findDate = undefined

    dailyLogs.find((dlog) => {
      findDate = dlog.logs.find(entry => {
        const logDate = new Date(entry.date).toDateString()
        return logDate === today
      })

      if (findDate?.log_ids_with_notes?.length) {
        updateSteps(findDate.log_ids_with_notes.map((obj: { id: string; notes: string }) => obj.id))
      } else {
        resetSteps()
      }

      return findDate
    })

    if (!findDate) {
      resetSteps()
    }

  }, [date, dailyLogs])

  if (!habit) {
    return <div>Loading...</div>
  }

  return (
    <main className="px-4 sm:px-6 lg:px-8 pb-20 md:py-8 w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">{habit.title}</h1>
        <p className="text-muted-foreground">Log your daily progress and stay on track</p>
      </div>

      {/* Date Picker */}
      <DatePicker date={date} onDateChange={setDate} habitCreatedAt={habit.createdAt} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Steps & Measurement */}
        <div className="lg:col-span-2 space-y-6">
          {/* Steps */}
          <StepLogger steps={steps} onUpdateSteps={setSteps} date={date} />

          {/* Measurement */}
          <MeasurementInput
            metric={habit.measurement.metric}
            target={habit.measurement.target}
            currentValue={measurementValue}
            onValueChange={setMeasurementValue}
          />

          {/* Save Button */}
          <Button size="lg" onClick={handleSaveLog} disabled={isSaving} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Log"}
          </Button>
        </div>

        {/* Right Column - History */}
        <div>
          <LogRendering
            habit={habit}
          />
        </div>
      </div>
    </main>
  )
}
