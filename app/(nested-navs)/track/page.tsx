"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/app/(nested-navs)/track/_components/date-picker"
import { StepLogger } from "@/app/(nested-navs)/track/_components/step-logger"
import { MeasurementInput } from "@/app/(nested-navs)/track/_components/measurement-input"
import { LogHistory } from "@/app/(nested-navs)/track/_components/log-history"
import { Save } from "lucide-react"
import { useTrackCtx } from "@/context-reducers/trackCtx"
import { mockLogs } from "@/lib/mock-data"
import { createHabitDailyTimeline, createHabitWeeklyTimeline } from "@/server-calls/habits"

export default function TrackPage() {
  const { state, dispatch } = useTrackCtx()
  // const habit = state.habits[state.habitViewing === -1 ? 0 : state.habitViewing - 1]

  const habit = state.habits.find((habit) => Number(habit.id) == state.habitViewing) ?? state.habits[0]

  const [date, setDate] = useState(new Date())
  const [measurementValue, setMeasurementValue] = useState(30)
  const [steps, setSteps] = useState(habit?.steps)

  // const habitStepLogs = habit.steps.map((s) => ({ id: s.id, habitId: habit.id, date: new Date(s.time), measurement: measurements.metric === "minutes" ? Number(measurements.target) / 60 : Number(measurements.target), notes: s.title }))

  const [logs, setLogs] = useState(mockLogs)
  // const [logs, setLogs] = useState(habitStepLogs)

  const [isSaving, setIsSaving] = useState(false)

  const saveTodb = async (data: any) => {
    // const response = await fetch("/api/habits/timeline", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // })

    // weekly tracking
    // const response = await createHabitWeeklyTimeline(data)
    // console.log(response, "response from saving timeline data")

    // daily tracking
    const resp = await createHabitDailyTimeline(data)
    console.log(resp, "response from saving daily timeline data")


    // if (response.ok) {
    //   const responseData = await response.json()
    //   console.log("Data saved successfully", data, responseData)
    // } else {
    //   console.error("Failed to save data")
    // }
  }
  const saveWeeklyTrackingTodb = async (data: any) => {
    const response = await createHabitWeeklyTimeline(data)
    console.log(response, "response from saving timeline data for weekly tracking")
  }

  const saveDailyTrackingTodb = async (data: any) => {
    const response = await createHabitDailyTimeline(data)
    console.log(response, "response from saving timeline data for daily tracking")
  }

  const handleSaveLog = async () => {
    setIsSaving(true)
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newLog = {
      // id: Math.random().toString(),
      id: state.habits[0].steps.length + 1,
      date,
      measurement: measurementValue,
      notes: "Logged from tracking page",
    }

    setLogs([newLog, ...logs] as any)
    setIsSaving(false)

    habit.steps = steps
    dispatch({
      type: 'UPDATE_HABIT',
      payload: habit
    })

    // update on daily tracking as well
    const payloadData = {
      habitId: habit.id,
      dateStamp: date,
      data: {
        totalCompleted: habit.steps.map(step => step.completed).filter(step => step).length,
        totalSteps: habit.steps.length,
        percentile: Math.round((habit.steps.map(step => step.completed).filter(step => step).length / habit.steps.length) * 100)
      }
    }

    dispatch({
      type: "SET_A_WEEK_COMPLETION_RATE",
      payload: payloadData
    })

    // save to db too
    const completedSteps = habit.steps.map(step => step.completed).filter(step => step)
    const totalSteps = habit.steps
    const percentile = Math.round((completedSteps.length / totalSteps.length) * 100)

    const dbrq = {
      habitId: habit.id,
      week: {
        weekStart: new Date(date.getTime() - (date.getDay() - 1) * 24 * 60 * 60 * 1000),
        weekEnd: new Date(date.getTime() + (6 - date.getDay()) * 24 * 60 * 60 * 1000),
        totalCompleted: completedSteps.length,
        // totalSteps: totalSteps.length * habit.duration,habit.steps.map(step => step.completed).filter(step => step)
        totalSteps: totalSteps.length,
        percentile: percentile
      }
    }

    // saveTodb(dbrq)
    // saveWeeklyTrackingTodb(dbrq)

    // save to db for daily tracking as well
    saveDailyTrackingTodb({
      habitId: habit.id,
      dateStamp: date,
      totalSteps: totalSteps.length,
      // percentile: percentile,
      steps: habit.steps,
      // completedSteps: habit.steps.filter(step => step.completed),
      // notes: "consider adding notes input in the UI for each day to log any specific notes for that day along with steps and measurement"
      
      // data: {
      //   // totalCompleted: completedSteps.length,
      //   totalSteps: totalSteps.length,
      //   percentile: percentile, 
      //   completedSteps: habit.steps.filter(step => step.completed)
      // }
    })

    // Show success message
    alert("Log saved successfully!")
  }

  const handleUndoLast = () => {
    if (logs.length > 0) {
      setLogs(logs.slice(1))
    }
  }

  if (!habit) {
    return <div>Loading...</div>
  }

  useEffect(() => {
    const whichDay = new Date(habit?.createdAt)?.toDateString() === date.toDateString() ? "today" : "different day"

    console.log(whichDay)

    if (whichDay === "different day") {
      // if its a different day we need to reset steps to empty array or fetch steps for that day if we have a history of steps for each day
      const todaySteps = habit.steps.map(step => {
        return {
          ...step,
          completed: false,
          // time: new Date(date.getTime() + Math.floor(Math.random() * (12 * 60 * 60 * 1000))).toISOString() // set random time for each step on that day to be within that day
        }
      })
      setSteps(todaySteps)
      return
    }
    else {
      setSteps(habit.steps)
    }
  }, [date])

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">{habit.title}</h1>
        <p className="text-muted-foreground">Log your daily progress and stay on track</p>
      </div>

      {/* Date Picker */}
      <DatePicker date={date} onDateChange={setDate} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Steps & Measurement */}
        <div className="lg:col-span-2 space-y-6">
          {/* Steps */}
          <StepLogger steps={steps} onUpdateSteps={setSteps} />

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
          <LogHistory
            logs={logs}
            onUndo={handleUndoLast}
            onDelete={(id) => setLogs(logs.filter((l) => l.id !== id))}
          />
        </div>
      </div>
    </main>
  )
}
