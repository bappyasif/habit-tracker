"use client"

import { MonthlyProps, useTrackCtx } from "@/context-reducers/trackCtx"
import { mockCalnderData } from "../_utils/calendar-mock-data"
import { useToInitializeMonthlyHeatmap } from "../_hooks/initializeMonthllyHeatmap"

interface HeatmapDay {
  date: Date
  value: number // 0-100
}

interface HeatmapCalendarProps {
  month: Date
  data: HeatmapDay[]
}

export function HeatmapCalendar(
  // { month, data }: HeatmapCalendarProps
) {
  // const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  // const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0)
  // const daysInMonth = lastDay.getDate()
  // const startingDayOfWeek = firstDay.getDay()

  // const days = []
  // for (let i = 0; i < startingDayOfWeek; i++) {
  //   days.push(null)
  // }
  // for (let i = 1; i <= daysInMonth; i++) {
  //   days.push(new Date(month.getFullYear(), month.getMonth(), i))
  // }

  const { days } = mockCalnderData()

  const { state } = useTrackCtx()

  // const days = state.habitInsights.find(insight => insight.habitId === state.habitViewing)?.monthly?.data.map(d => d.date) || []
  // ?.data.map(d => d.date) || []

  // console.log("HeatmapCalendar data from context:", state.habitInsights.find(insight => insight.habitId === state.habitViewing)?.monthly, "days", days)

  // const days = state.habitInsights.find(insight => insight.habitId == state.habitViewing)?.monthly || []

  // console.log(days, "<<DAYS>>!!", test)

  // const days = state.habitInsights.find(insight => insight.habitId === state.habitViewing)?.monthly?.data.map(d => d.date)

  useToInitializeMonthlyHeatmap()

  const data = state.habitInsights.find(insight => insight.habitId == state.habitViewing)?.monthly || []

  const getIntensity = (date: Date | null) => {
    if (!date) return "bg-muted/20"
    const monthData = data.find((d) => d.month == date?.getMonth())?.data || []
    const dayData = monthData.find((d) => d?.date?.toDateString() == date?.toDateString())
    console.log("dayData for date", date, "is", dayData, data, date?.getMonth(), monthData)
    const value = dayData?.value || 0
    if (value === 0) return "bg-muted/20"
    if (value < 33) return "bg-primary/30"
    if (value < 66) return "bg-primary/60"

    console.log("Value for date", date, "is", value)
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
        {days?.map(
          // ({ month, data }, idx) => (
          (date, idx) => {
            // console.log("Rendering cell for date", date, "with data")
            return (
              <div
                key={idx}
                // className={`aspect-square rounded flex items-center justify-center text-xs font-semibold transition-colors ${getIntensity(
                //   // date?.data?.[0]?.date,
                //   date,
                //   // date.data
                //   // date.data?.[0]?.date || null
                // )}`}
                className={`aspect-square rounded flex items-center justify-center text-xs font-semibold transition-colors ${getIntensity(date)}`}
                title={date ? date.toDateString() : ""}
              >
                {/* {date?.month && date?.month.getDate()} */}
                {date?.getDate()}
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
