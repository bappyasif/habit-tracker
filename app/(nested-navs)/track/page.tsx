"use client"

import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/app/(nested-navs)/track/_components/date-picker"
import { StepLogger } from "@/app/(nested-navs)/track/_components/step-logger"
import { MeasurementInput } from "@/app/(nested-navs)/track/_components/measurement-input"
import { Save } from "lucide-react"
import { useTrackCtx } from "@/context-reducers/trackCtx"
import { LogRendering } from "./_components/log-rendering"
import { useToHandleDailyTimelineSaveOrUpdate } from "./_hooks/useToHandleDailyTimelineSaveOrUpdate"
import { set } from "date-fns"

export default function TrackPage() {
  const { state, dispatch } = useTrackCtx()

  const habit = state.habits.find((habit) => Number(habit.id) == state.habitViewing)

  console.log(habit, "habit frpom track page", state.habits)

  if (!habit) {
    return <div>Loading...</div>
  }

  const [date, setDate] = useState(new Date())
  const [measurementValue, setMeasurementValue] = useState(habit.measurement.target)
  const backup = habit?.steps.map(step => ({
    ...step,
    // completed: false,
    notes: "initial state from backup"
  })) || []

  const [steps, setSteps] = useState(backup)

  const { dailyLogs } = state

  // const updateSteps = (ids: (number | string)[]) => {
  //   const tempSteps = steps.map(step => {
  //     const sid = ids?.findIndex(v => v == step.id)

  //     return {
  //       ...step,
  //       completed: sid !== -1 ? true : step.completed
  //     }
  //   })

  //   setSteps(tempSteps)
  // }

  const updateSteps = (ids: (number | string)[]) => {
    const tempSteps = backup.map(step => {
      const sid = ids?.findIndex(v => v == step.id)

      return {
        ...step,
        completed: sid !== -1 ? true : step.completed
      }
    })

    setSteps(tempSteps)
  }

  const resetSteps = () => {
    // const todaySteps = habit.steps.map(step => {
    //   return {
    //     ...step,
    //     completed: false,
    //     notes: step.notes ?? "reset for initial state"
    //   }
    // })
    const todaySteps = backup.map(step => {
      return {
        ...step,
        completed: false,
        notes: "resetted for initial state"
      }
    })
    setSteps(todaySteps)
  }

  const {handleSaveLog, isSaving} = useToHandleDailyTimelineSaveOrUpdate({ habit, date, steps, updateSteps })

  // useEffect(() => {
  //   setSteps(backup)
  // }, [])

  // useEffect(() => {
  //   resetSteps()
  // }, [date])

  // update steps completion based on daily logs for the selected date
  useEffect(() => {
    const today = date.toDateString()

    let findDate = undefined

    const checkIfHabitStepFoundInDailyLogs = dailyLogs.find((dlog) => {
      findDate = dlog.logs.find(entry => {
        const logDate = new Date(entry.date).toDateString()
        return logDate === today
      })

      if (findDate?.ids?.length) {
        updateSteps(findDate.ids)
      } else {
        resetSteps()
      }
      return findDate
    })

    const getDateDailyLogs = checkIfHabitStepFoundInDailyLogs?.logs.find(entry => {
      const logDate = new Date(entry.date).toDateString()
      return logDate === today
    })

    console.log(checkIfHabitStepFoundInDailyLogs, "checkIfHabitStepFoundInDailyLogs", getDateDailyLogs, "getDateDailyLogs", habit.steps, "habit.steps", state)

    if (!findDate) {
      resetSteps()
    }

    // resetSteps()

  }, [date, dailyLogs])

  if (!habit) {
    return <div>Loading...</div>
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            // logs={logs}
            // setLogs={setLogs}
            habit={habit}
          />
          {/* <LogHistory
            // logs={logs}
            logs={mappedLogsFromHabit as LogEntry[]}
            onUndo={handleUndoLast}
            onDelete={(id) => setLogs(logs.filter((l) => l.id !== id))}
          /> */}
        </div>
      </div>
    </main>
  )
}
