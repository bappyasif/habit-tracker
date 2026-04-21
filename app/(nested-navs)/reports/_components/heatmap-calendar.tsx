"use client"

import { useTrackCtx } from "@/context-reducers/trackCtx"
import { mockCalnderData } from "../_utils/calendar-mock-data"
import { useToInitializeMonthlyHeatmap } from "../_hooks/initializeMonthllyHeatmap"
import { log } from "console"

export function HeatmapCalendar() {
  const { days } = mockCalnderData()

  const { state } = useTrackCtx()

  const dailyData = state.dailyLogs.find(log => log.habitId == state.habitViewing)?.logs || []

  console.log("Daily Data:", dailyData)
  console.log("Days", days)
  const logEntries = dailyData.map(log =>{
    console.log("Log:", log, "test".repeat(log.ids.length), new Date(log.date).toLocaleDateString().repeat(log.ids.length))
    // return new Date(log.date).toLocaleDateString().repeat(log.ids.length)
    return log.date.toString().repeat(log.ids.length)
  })

  const mappedDays = days.map((day) => {
    const logForDay = dailyData.find(log => new Date(log.date).toDateString() === day?.toDateString())
    console.log("Log For Day:", logForDay)
    return logForDay ? new Date(logForDay.date) : day
  })

  console.log("Mapped Days:", mappedDays)

  useToInitializeMonthlyHeatmap()

  const data = state.habitInsights.find(insight => insight.habitId == state.habitViewing)?.monthly || []

  // const getIntensity = (date: Date | null) => {
  //   if (!date) return "bg-muted/20"
  //   const monthData = data.find((d) => d.month == date?.getMonth())?.data || []
  //   const dayData = monthData.find((d) => d?.date?.toDateString() == date?.toDateString())
    
  //   const value = dayData?.value || 0
  //   if (value === 0) return "bg-muted/20"
  //   if (value < 33) return "bg-primary/30"
  //   if (value < 66) return "bg-primary/60"

  //   return "bg-primary"
  // }

  const getIntensity = (date: Date | null) => {
    if (!date) return "bg-muted/20"
    // const data = state.habitInsights.find(insight => insight.habitId == state.habitViewing)?.monthly

    const adjustMonthlyDtaValuyesAsPerDailyData = data.map(month => {
      const monthData = month?.data.map(day => {
        const logForDay = dailyData.find(log => new Date(log.date).toDateString() === day?.date?.toDateString())
        console.log("Log For Day:", logForDay)
        if (logForDay) {
          return {
            ...day,
            value: logForDay.ids.length * 100 // we need to repurpose value to correctly convert these into percentile value, by accessing total steps and completed steps, here we only have completed steps
            // value: 33
          }
        }
        return {
          ...day,
          // value: 0
          value: -1
        }
      })

      return {
        ...month,
        data: monthData
      }
    })

    console.log("Data:", data)
    console.log("Adjust Monthly Data:", adjustMonthlyDtaValuyesAsPerDailyData)
    // const monthData = data?.find((d) => d.month == date?.getMonth())?.data || []
    const monthData = adjustMonthlyDtaValuyesAsPerDailyData?.find((d) => d.month == date?.getMonth())?.data || []

    const dayData = monthData?.find((d) => d?.date?.toDateString() == date?.toDateString())
    
    const value = dayData?.value || 0

    console.log("Date:", date, "Value:", value, "MonthData:", monthData, "DayData:", dayData, state.habitInsights, date.getMonth(), data)

    if (value === 0) return "bg-muted/20"
    if (value < 33) return "bg-primary/30"
    if (value < 66) return "bg-primary/60"

    return "bg-primary"
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-2">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {
        // days
        // logEntries
        mappedDays
        ?.map(
          (date, idx) => {
            return (
              <div
                key={idx}
                // className={`aspect-square rounded flex items-center justify-center text-xs font-semibold transition-colors ${getIntensity(date)}`}
                // className={`aspect-square rounded flex items-center justify-center text-xs font-semibold transition-colors ${getIntensity(date?.toDateString() ? new Date(date.toDateString()) : null)}`}
                className={`aspect-square rounded flex items-center justify-center text-xs font-semibold transition-colors ${getIntensity(date)}`}
                // title={date ? date.toDateString() : ""}
                title={date ? date.toLocaleDateString() : ""}
              >
                {date?.getDate()}
                {/* {date ? new Date(date).getDate() : date} */}
                {/* {date?.getDate() || new Date(date).getDate()} */}
              </div>
            )
          })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 text-xs mt-4">
        <span className="text-muted-foreground">Less</span>
        <div className="w-3 h-3 rounded bg-muted/20" />
        <div className="w-3 h-3 rounded bg-primary/30" />
        <div className="w-3 h-3 rounded bg-primary/60" />
        <div className="w-3 h-3 rounded bg-primary" />
        <span className="text-muted-foreground">More</span>
      </div>
    </div>
  )
}
