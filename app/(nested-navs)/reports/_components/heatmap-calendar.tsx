"use client"

import { useTrackCtx } from "@/context-reducers/trackCtx"
import { mockCalnderData } from "../_utils/calendar-mock-data"
import { useToInitializeMonthlyHeatmap } from "../_hooks/initializeMonthllyHeatmap"

export function HeatmapCalendar() {
  const { days } = mockCalnderData()

  const { state } = useTrackCtx()

  useToInitializeMonthlyHeatmap()

  const data = state.habitInsights.find(insight => insight.habitId == state.habitViewing)?.monthly || []

  const getIntensity = (date: Date | null) => {
    if (!date) return "bg-muted/20"
    const monthData = data.find((d) => d.month == date?.getMonth())?.data || []
    const dayData = monthData.find((d) => d?.date?.toDateString() == date?.toDateString())
    
    const value = dayData?.value || 0
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
        {days?.map(
          (date, idx) => {
            return (
              <div
                key={idx}
                className={`aspect-square rounded flex items-center justify-center text-xs font-semibold transition-colors ${getIntensity(date)}`}
                title={date ? date.toDateString() : ""}
              >
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
