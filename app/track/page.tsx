"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/app/track/_components/date-picker"
import { StepLogger } from "@/app/track/_components/step-logger"
import { MeasurementInput } from "@/app/track/_components/measurement-input"
import { LogHistory } from "@/app/track/_components/log-history"
import { mockHabits, mockLogs } from "@/lib/mock-data"
import { Save } from "lucide-react"

export default function TrackPage() {
  const habit = mockHabits[0]
  const [date, setDate] = useState(new Date())
  const [measurementValue, setMeasurementValue] = useState(30)
  const [steps, setSteps] = useState(habit.steps)
  const [logs, setLogs] = useState(mockLogs)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveLog = async () => {
    setIsSaving(true)
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newLog = {
      id: Math.random().toString(),
      date,
      measurement: measurementValue,
      notes: "Logged from tracking page",
    }

    setLogs([newLog, ...logs] as any)
    setIsSaving(false)

    // Show success message
    alert("Log saved successfully!")
  }

  const handleUndoLast = () => {
    if (logs.length > 0) {
      setLogs(logs.slice(1))
    }
  }

  return (
    <>
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
    </>
  )
}
