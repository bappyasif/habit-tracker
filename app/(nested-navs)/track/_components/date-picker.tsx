"use client"

import { Button } from "../../../../components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DatePickerProps {
  date: Date
  onDateChange: (date: Date) => void, 
  habitCreatedAt: Date
}

export function DatePicker({ date, onDateChange, habitCreatedAt }: DatePickerProps) {
  const handlePrevDay = () => {
    // so that it doesnt go back earlier than habit createAt date
    if (date.toDateString() == new Date(habitCreatedAt).toDateString()) return
    // if (date.toDateString() === new Date().toDateString()) return
    const newDate = new Date(date)
    newDate.setDate(date.getDate() - 1)
    onDateChange(newDate)
  }

  const handleNextDay = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() + 1)
    onDateChange(newDate)
  }

  const handleToday = () => {
    onDateChange(new Date())
  }

  const isToday = new Date().toDateString() === date.toDateString()

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <Button size="sm" variant="outline" onClick={handlePrevDay}>
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex-1 text-center">
        <p className="text-2xl font-bold">
          {date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </p>
        {!isToday && (
          <Button size="sm" variant="ghost" onClick={handleToday} className="mt-1 text-xs">
            Back to Today
          </Button>
        )}
      </div>

      <Button size="sm" variant="outline" onClick={handleNextDay}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
