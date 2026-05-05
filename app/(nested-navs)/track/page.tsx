"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/app/(nested-navs)/track/_components/date-picker"
import { StepLogger } from "@/app/(nested-navs)/track/_components/step-logger"
import { MeasurementInput } from "@/app/(nested-navs)/track/_components/measurement-input"
import { LogEntry, LogHistory } from "@/app/(nested-navs)/track/_components/log-history"
import { Save } from "lucide-react"
import { useTrackCtx } from "@/context-reducers/trackCtx"
import { mockLogs } from "@/lib/mock-data"
import { createHabitDailyTimeline, createHabitWeeklyTimeline, updateHabitDailyTimeline } from "@/server-calls/habits"

export default function TrackPage() {
  const { state, dispatch } = useTrackCtx()

  const habit = state.habits.find((habit) => Number(habit.id) == state.habitViewing)

  console.log(habit, "habit frpom track page", state.habits)

  if (!habit) {
    return <div>Loading...</div>
  }

  const [date, setDate] = useState(new Date())
  const [measurementValue, setMeasurementValue] = useState(30)
  const [steps, setSteps] = useState(habit?.steps)

  const { dailyLogs } = state

  //   : {
  //     id: string;
  //     habitId: string;
  //     date: Date;
  //     measurement: number;
  //     stepsCompleted: boolean[];
  //     notes: string;
  // }

  const mappedLogsFromHabit = dailyLogs.map((dlog) => {
    // console.log(dlog, "dlog")
    let obj_itm = {}
    dlog.logs.forEach((log) => {
      // console.log(log, "log")
      const measurement = habit.measurement.target
      // const completedSteps = habit.steps.map((step) => step.completed).filter(Boolean)

      
      log.log_ids_with_notes.forEach((obj) => {
        const step = habit.steps.find((step) => step.id == obj.id)
        const notes = obj.notes || step?.notes || "Not Found"

        obj_itm = {
          id: obj.id,
          notes: notes,
          // habitId: dlog.habitId,
          date: new Date(log.date).toISOString(),
          measurement,
        }
      })

      // return log?.ids?.forEach((id) => {
      //   // const step = habit.steps.find((step) => step.id == id)
      //   // const notes = habit.steps.find((step) => step.id == id)?.notes
      //   const notes = log.log_ids_with_notes.find((obj) => obj.id == id)?.notes || "None found from fe"

      //   obj = {
      //     id: id,
      //     // habitId: dlog.habitId,
      //     date: new Date(log.date),
      //     measurement,
      //     // stepsCompleted: completedSteps,
      //     // notes: log.notes,
      //     // notes: step?.notes || log.notes || "Not Found",
      //     // notes: log.notes || step?.notes || "Not Found",
      //     notes: notes || "None found from fe",
      //   }
      //   // return {
      //   //   id: id,
      //   //   habitId: dlog.habitId,
      //   //   date: log.date,
      //   //   measurement,
      //   //   stepsCompleted: completedSteps,
      //   //   notes: log.notes,
      //   // }
      // })
    })

    return obj_itm
  })

  console.log(mappedLogsFromHabit, "mappedLopgsFromHabit")

  const [logs, setLogs] = useState(mockLogs)

  const [isSaving, setIsSaving] = useState(false)

  const saveWeeklyTrackingTodb = async (data: any) => {
    const response = await createHabitWeeklyTimeline(data)
    console.log(response, "response from saving timeline data for weekly tracking")
  }

  const saveDailyTrackingTodb = async (data: any) => {
    const response = await createHabitDailyTimeline(data)
    console.log(response, "response from saving timeline data for daily tracking", data)
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

    console.log(checkIfHabitStepFoundInDailyLogs, "checkIfHabitStepFoundInDailyLogs", date, "date",)

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

        if (dataUpdated) {
          console.log("dataUpdated for daily timeline", dataUpdated)
          dispatch({
            type: "TOGGLE_DAILY_TRACKING_LOG",
            payload: {
              habitId: habit.id,
              date: date,
              // ids: dataUpdated?.completed_steps_ids || [],
              log_ids_with_notes: dataUpdated?.steps_completed_with_notes || [],
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
          notes: step.notes || "None found from fe",
        })),
        completedSteps: habit.steps.filter(step => step.completed).map(step => ({
          ...step,
          id: step.id.toString(),
          notes: step.notes || "None found from fe",
          // note: "None",
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

  // const { dailyLogs } = state

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

    const checkIfHabitStepFoundInDailyLogs = dailyLogs.find((dlog) => {
      findDate = dlog.logs.find(entry => {
        const logDate = new Date(entry.date).toDateString()
        return logDate === today
      })

      // THINGS TO DO NEXT
      // we will have to restructure this data as notes will or could be different for each datestamps
      // we will have to restructure reducers state toi have a different dtaa structires to accomodate bnoth id and notes for each daily log for steps
      // we will aslso have to re arrange response from backend to serve this purpose for frontend currently it only tends to send a blank notes which is not correct

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

    // now we need to reset steps as it remains same for all days!! it needs to rerender when date changes, specifically steps ids are not changing and it doesnt really match with date wise rendered steps ids, either we need to reset or find a way to match it. 
    // in reports page it correctly matches with steps ids so gotta be able to get similar behaviour here as well.

    // NEW THOUGHT PROCESS
    // FINDINGS:
    /**
     * we are correc tly fetching habit from server
     * we are correctly fetching daily logs from server
     * but for tracking page we are using same data from one date with rest of them to keep things simple reason why it is not correctly showiung actual step ionformation from server
     * currently we are simply toggling steps ids based on it reciorded in dailylogs for that datestamp
     * any update made on Habit is simply gets updated on server for first appeared datestamp found on its records.
     */
    // CONSIDERATION:
    /**
     * we would have to fetch habit steps only from server for that specific datestamp
     * for that to happen we would have to first include datestamp in api reques and also have it accepted in server db model as well
     * as our Habit remains same for all dates only our steps is changing for different dates in dashboard and tracking page, so we would have to fetch steps for that specific datestamp from server
     * for updates we would have to update only that specific habit that matches its update datestamp for that habit in records.
     * when updating tracking details we would have to fascilitate a differenrt route point to ensure its correct updates
     * for example, currenytly our habit has changeable data in edit page where we can update title, description, measurements and steps, and when tracking each habit for different dates keeping rest of Habit data intact, so we would have to fetch only steps for that specific datestamp from server and record updates based on that datestamp. and in frontend we would have to update steps for that specific datestamp only by fetching steps from server for that datestamp
     */

    /**
     * UPDATED CONSIDERATION
     * 
     * ASSESSMENT:
     * on another thought came to reaslize that Habit Steps are supposed to be same on each date as they supposed to be tracked similarly for each datestamp
     * 
     * now we have to make sure why is that "step id" changes after a few days for previous ones?!
     * 
     * DO CHECK THIS TOMORROW!!
     * probably that happened becauyse of we delted a step within a habit and then added a new one  thus possibly creating a backlog of steps idds with removed steps from earlier!!
     */


    console.log(checkIfHabitStepFoundInDailyLogs, "checkIfHabitStepFoundInDailyLogs", getDateDailyLogs, "getDateDailyLogs", habit.steps, "habit.steps", state)

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
          <LogHistory
            // logs={logs}
            logs={mappedLogsFromHabit as LogEntry[]}
            onUndo={handleUndoLast}
            onDelete={(id) => setLogs(logs.filter((l) => l.id !== id))}
          />
        </div>
      </div>
    </main>
  )
}
