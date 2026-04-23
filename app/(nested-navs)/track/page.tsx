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
import { createHabitDailyTimeline, createHabitWeeklyTimeline, updateHabitDailyTimeline } from "@/server-calls/habits"

export default function TrackPage() {
  const { state, dispatch } = useTrackCtx()
  
  const habit = state.habits.find((habit) => Number(habit.id) == state.habitViewing)

  if(!habit) {
    return <div>Loading...</div>
  }

  const [date, setDate] = useState(new Date())
  const [measurementValue, setMeasurementValue] = useState(30)
  const [steps, setSteps] = useState(habit?.steps)

  const [logs, setLogs] = useState(mockLogs)

  const [isSaving, setIsSaving] = useState(false)
  
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

    const checkIfHabitStepFoundInDailyLogs = dailyLogs.find((dlog) => {
      const findDate = dlog.logs.find(entry => {
        const logDate = new Date(entry.date).toDateString()
        return logDate === date.toDateString()
      })

      if (findDate) {
        updateSteps(findDate.ids)
      }
      return findDate
    })

    const completedSteps = habit.steps.map(step => step.completed).filter(step => step)
    const totalSteps = habit.steps
    const percentile = Math.round((completedSteps.length / totalSteps.length) * 100)

    if (checkIfHabitStepFoundInDailyLogs) {
      const tt = {
        habitId: habit.id.toString(),
        dateStamp: date,
        totalSteps: totalSteps.length,
        steps: habit.steps.map(step => ({
          ...step,
          id: step.id.toString(),
          note: "None",
        })),
        completedSteps: habit.steps.filter(step => step.completed).map(step => ({
          ...step,
          id: step.id.toString(),
          note: "None",
        })),
      }

      updateHabitDailyTimeline(tt).then((resp) => {
        console.log(resp, "response from updating daily timeline data for daily tracking")
        const dataUpdated = resp?.data?.entry?.filter((item: any) => item.habit_id == habit.id && new Date(item.date_stamp).toDateString() == date.toDateString())?.[0] || null

        if(dataUpdated) {
          dispatch({
          type: "TOGGLE_DAILY_TRACKING_LOG",
          payload: {
            habitId: habit.id,
            date: date,
            ids: dataUpdated?.completed_steps_ids || [],
            totalSteps: totalSteps.length,
            percentile: percentile
          }
        })
        }
      })
    } else {
      // save to db too
      const dbrq = {
        habitId: habit.id,
        week: {
          weekStart: new Date(date.getTime() - (date.getDay() - 1) * 24 * 60 * 60 * 1000),
          weekEnd: new Date(date.getTime() + (6 - date.getDay()) * 24 * 60 * 60 * 1000),
          totalCompleted: completedSteps.length,
          totalSteps: totalSteps.length,
          percentile: percentile
        }
      }

      // saveTodb(dbrq)
      saveWeeklyTrackingTodb(dbrq)

      // save to db for daily tracking as well
      saveDailyTrackingTodb({
        habitId: habit.id.toString(),
        dateStamp: date,
        totalSteps: totalSteps.length,
        steps: habit.steps.map(step => ({
          ...step,
          id: step.id.toString(),
          note: "None",
        })),
        completedSteps: habit.steps.filter(step => step.completed).map(step => ({
          ...step,
          id: step.id.toString(),
          note: "None",
        })),
        // notes: "consider adding notes input in the UI for each day to log any specific notes for that day along with steps and measurement"
      })
    }

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

  const { dailyLogs } = state

  const updateSteps = (ids: (number | string)[]) => {
    const tempSteps = steps.map(step => {
      const sid = ids?.findIndex(v => v == step.id)

      return {
        ...step,
        completed: sid !== -1 ? true : step.completed
      }
    })

    setSteps(tempSteps)
  }

  const resetSteps = () => {
    const todaySteps = habit.steps.map(step => {
      return {
        ...step,
        completed: false,
      }
    })
    setSteps(todaySteps)
  }

  useEffect(() => {
    const today = date.toDateString()

    let findDate = undefined

    dailyLogs.find((dlog) => {
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

    if (!findDate) {
      resetSteps()
    }

  }, [date, dailyLogs])

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
