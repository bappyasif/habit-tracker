import { useMemo } from "react"
import { useTrackCtx } from "@/context-reducers/trackCtx"

// Derived, not stored: the habit being viewed, with today's completed steps applied.
// No useState / useEffect, so there is no stale closure and no one-render lag.
export const useToUpdateHabitStepsCompletion = () => {
  const { state } = useTrackCtx()
  const { habitViewing, dailyLogs } = state

  // const habit = state.habits.find((h) => Number(h.id) === Number(habitViewing)) || state.habits[0]
  const habit = state.habits.find((h) => Number(h.id) === Number(habitViewing))

  const updatedHabit = useMemo(() => {
    if (!habit) return undefined

    const today = new Date().toDateString()

    // THIS habit's log entry for TODAY (not just the first entry that has notes)
    const todaysEntry = dailyLogs
      ?.find((d) => d.habitId == habit.id)
      ?.logs?.find((l) => new Date(l.date).toDateString() === today)

    // String() so "5" and 5 still match
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

  // undefined when no habit is selected yet, so `updatedHabit || habits[0]` falls back correctly
  return { updatedHabit }
}



// import { useTrackCtx } from "@/context-reducers/trackCtx"
// import { useEffect, useState } from "react"

// export const useToUpdateHabitStepsCompletion = () => {
//     const { state } = useTrackCtx()
//     const { habitViewing, dailyLogs } = state

//     console.log(habitViewing)

//     const habit = state.habits.find(habit => Number(habit.id) === habitViewing)

//     const date = new Date()
    
//     const [steps, setSteps] = useState(habit?.steps || [])

//     const resetSteps = () => {
//         const todaySteps = habit?.steps.map(step => {
//             return {
//                 ...step,
//                 completed: false,
//             }
//         })
//         if (todaySteps) {
//             setSteps(todaySteps)
//         }
//     }

//     const updateOrReset = () => {
//         console.log(dailyLogs, "dailyLogs", habitViewing, steps, habit)
//         const habitDailyLogs = dailyLogs.find(obj => obj.habitId == habitViewing)
//         console.log(habitDailyLogs, "habitDailyLogs")
//         if (!habitDailyLogs) {
//             // setSteps(habit?.steps!)
//             console.log(steps, "steps")
//             resetSteps()
//             console.log(steps, "steps updated")
//         } else {
//             console.log("HERE DAILYLOGS found")
//             setSteps(habit?.steps!) // this is where habit steps gets added before they are updated
//             // const sis = habitDailyLogs.logs.find(entry => entry.log_ids_with_notes)?.log_ids_with_notes.map(o => o.id)
//             // updateSteps(sis!)

//             const ids = habitDailyLogs.logs.find(entry => entry.log_ids_with_notes)?.log_ids_with_notes.map(o => o.id)

//             console.log(ids, "IDS")

//             const temps = steps.map(step => {
//                 console.log(ids?.findIndex(v => v===step.id) !== -1, "??!!")
//                 return {
//                     ...step,
//                     completed: ids?.findIndex(v => v===step.id) !== -1
//                 }
//             })

//             console.log(temps, "TEMPS") // its showing updated steps with completed as true
//             setSteps(temps) // here its not really updating steps, for somereadon, it still remains before temps, values!! why?
//             // if(temps.length) {
//             //     setSteps(temps)
//             // }
//         }
//     }

//     useEffect(() => {
//         updateOrReset()

//     }, [habitViewing, dailyLogs])

//     const [updatedHabit, setUpdatedHabit] = useState({
//         ...habit,
//         steps: habit?.steps || []
//     })

//     useEffect(() => {
//         setUpdatedHabit({
//             ...habit,
//             steps: steps
//         })
//     }, [steps, habit])

//     // console.log(updatedHabit, "updatedHabit - did update steps?")

//     return { updatedHabit }
// }




// import { useTrackCtx } from "@/context-reducers/trackCtx"
// import { useEffect, useState } from "react"

// export const useToUpdateHabitStepsCompletion = () => {
//     const { state } = useTrackCtx()
//     const { habitViewing, dailyLogs } = state

//     console.log(habitViewing)

//     const habit = state.habits.find(habit => Number(habit.id) === habitViewing)

//     // console.log("habit", habit)

//     // const [date, setDate] = useState(new Date())
//     const date = new Date()
//     const [steps, setSteps] = useState(habit?.steps || [])

//     // const updateSteps = (ids: (number | string)[]) => {
//     //     console.log(steps, "steps!!")
//     //     const tempSteps = steps.map(step => {
//     //         const sid = ids?.findIndex(v => v == step.id)

//     //         const notesFromDailyLog = dailyLogs?.find(dlog => dlog.habitId == habit?.id)?.logs?.find(log => new Date(log.date).toDateString() == date.toDateString())?.log_ids_with_notes?.find((obj: { id: string; notes: string }) => obj.id == step.id)?.notes

//     //         return {
//     //             ...step,
//     //             completed: sid !== -1 ? true : step.completed,
//     //             notes: notesFromDailyLog || step.notes || "None found: useToUpdateHabitStepsCompletion"
//     //         }
//     //     })

//     //     // console.log("tempstemps", tempSteps)

//     //     setSteps(tempSteps)
//     // }

//     const resetSteps = () => {
//         const todaySteps = habit?.steps.map(step => {
//             return {
//                 ...step,
//                 completed: false,
//             }
//         })
//         if (todaySteps) {
//             setSteps(todaySteps)
//         }
//     }

//     // const updateOrReset = () => {
//     //     // console.log("updateOrReset", steps, dailyLogs)

//     //     // found reason why its not correctly updating stpes as "Habit id" is not found in "dailyLogs", or findout how dailyLogs can trace back to habit id its realted so that dashboard correctly reflect when user vistis in any of them

//     //     // look at how habit title are updating correctly but not its steps and its corresponding calculations

//     //     const today = date.toDateString()

//     //     // let findDate = undefined

//     //     // const habitDailyLogs = dailyLogs.find(dl => Number(dl.habitId) === habitViewing)
//     //     const habitDailyLogs = dailyLogs.find(dl => dl.habitId == habitViewing)

//     //     const hdlogs = habitDailyLogs?.logs

//     //     console.log(hdlogs, "hdlogs", dailyLogs)

//     //     const findDate = hdlogs?.find(entry => {
//     //         console.log(entry, "!!entry!!")
//     //         const logDate = new Date(entry.date).toDateString()
//     //         return logDate === today
//     //     })

//     //     console.log(findDate, "findDate")

//     //     // updateSteps((findDate!.log_ids_with_notes || []).map((obj: { id: string; notes: string }) => obj.id))

//     //     if (findDate?.log_ids_with_notes?.length) {
//     //         updateSteps(findDate.log_ids_with_notes.map((obj: { id: string; notes: string }) => obj.id))
//     //     } else {
//     //         console.log("resetting steps")
//     //         resetSteps()
//     //     }

//     //     // dailyLogs.find((dlog) => {
//     //     //     findDate = dlog.logs.find(entry => {
//     //     //         const logDate = new Date(entry.date).toDateString()
//     //     //         return logDate === today
//     //     //     })

//     //     //     console.log(findDate, "findDate")

//     //     //     if (findDate?.log_ids_with_notes?.length) {
//     //     //         updateSteps(findDate.log_ids_with_notes.map((obj: { id: string; notes: string }) => obj.id))
//     //     //     } else {
//     //     //         console.log("resetting steps")
//     //     //         resetSteps()
//     //     //     }
//     //     //     return findDate
//     //     // })

//     //     // console.log("findDate", findDate, "steps", steps)

//     //     if (!findDate) {
//     //         resetSteps()
//     //     }
//     // }

//     const updateOrReset = () => {
//         console.log(dailyLogs, "dailyLogs", habitViewing, steps, habit)
//         const habitDailyLogs = dailyLogs.find(obj => obj.habitId == habitViewing)
//         console.log(habitDailyLogs, "habitDailyLogs")
//         if (!habitDailyLogs) {
//             // setSteps(habit?.steps!)
//             console.log(steps, "steps")
//             resetSteps()
//             console.log(steps, "steps updated")
//         } else {
//             console.log("HERE DAILYLOGS found")
//             setSteps(habit?.steps!) // this is where habit steps gets added before they are updated
//             // const sis = habitDailyLogs.logs.find(entry => entry.log_ids_with_notes)?.log_ids_with_notes.map(o => o.id)
//             // updateSteps(sis!)

//             const ids = habitDailyLogs.logs.find(entry => entry.log_ids_with_notes)?.log_ids_with_notes.map(o => o.id)

//             console.log(ids, "IDS")

//             const temps = steps.map(step => {
//                 console.log(ids?.findIndex(v => v===step.id) !== -1, "??!!")
//                 return {
//                     ...step,
//                     completed: ids?.findIndex(v => v===step.id) !== -1
//                 }
//             })

//             console.log(temps, "TEMPS") // its showing updated steps with completed as true
//             setSteps(temps) // here its not really updating steps, for somereadon, it still remains before temps, values!! why?
//             // if(temps.length) {
//             //     setSteps(temps)
//             // }
//         }
//     }

//     useEffect(() => {
//         updateOrReset()

//     }, [habitViewing, dailyLogs])

//     const [updatedHabit, setUpdatedHabit] = useState({
//         ...habit,
//         steps: habit?.steps || []
//     })

//     useEffect(() => {
//         setUpdatedHabit({
//             ...habit,
//             steps: steps
//         })
//     }, [steps, habit])

//     // console.log(updatedHabit, "updatedHabit - did update steps?")

//     return { updatedHabit }
// }