"use client"

import { useEffect, useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent } from "../../../../components/ui/card"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import { Checkbox } from "../../../../components/ui/checkbox"
import { ChevronDown, Mic, Camera } from "lucide-react"
import { useTrackCtx } from "@/context-reducers/trackCtx"

interface Step {
  id: string
  title: string
  time: string
  completed: boolean
  notes?: string
  photo?: string
  voiceNote?: string
}

interface StepLoggerProps {
  steps: Step[]
  onUpdateSteps: (steps: Step[]) => void,
  date: Date
}

export function StepLogger({ steps, onUpdateSteps, date }: StepLoggerProps) {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null)

  const handleToggleStep = (id: string) => {
    onUpdateSteps(steps.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)))
  }

  const handleUpdateStep = (id: string, field: string, value: any) => {
    onUpdateSteps(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const [stepNote, setStepNote] = useState("")

  const [stepChecked, setStepChecked] = useState(false)

  const { state: trackState } = useTrackCtx()

  // const stepNoteFromDailyLogsTimeline = trackState.dailyLogs
  // .find(dlog => dlog.habitId == trackState.habitViewing)?.logs.find(log => log.log_ids_with_notes.find(obj => obj.id == expandedStepId))?.log_ids_with_notes.find(obj => obj.id == expandedStepId)

  // const stepNoteFromDailyLogsTimeline = trackState.dailyLogs
  //   .find(dlog => dlog.habitId == trackState.habitViewing)?.logs?.filter(log => new Date(log.date)?.toDateString() == date?.toDateString())
  //   .find(log => log.log_ids_with_notes.find(obj => obj.id == expandedStepId))?.log_ids_with_notes.find(obj => obj.id == expandedStepId)

  const dlFound = trackState.dailyLogs.find(dlog => dlog.habitId == trackState.habitViewing)
  console.log(dlFound, "dlFound")

  const dateFilteredLogs = dlFound?.logs?.filter(log => new Date(log.date)?.toDateString() == date?.toDateString()) || []
  console.log(dateFilteredLogs, "dateFilteredLogs")

  const stepNoteFromDailyLogsTimeline = dateFilteredLogs?.find(log => log.log_ids_with_notes.find(obj => obj.id == expandedStepId))?.log_ids_with_notes.find(obj => obj.id == expandedStepId)

  useEffect(() => {
    if(dateFilteredLogs.length == 0) return
    setStepNote(stepNoteFromDailyLogsTimeline?.notes || "")
    // setStepChecked(stepNoteFromDailyLogsTimeline?.id == expandedStepId ? true : false)

    // console.log(stepNoteFromDailyLogsTimeline?.id == expandedStepId, "?!?!?!", stepNoteFromDailyLogsTimeline, expandedStepId)
  }, [dateFilteredLogs])

  // ?.log_ids_with_notes.find(obj => ({id: obj.id, notes: obj.notes}))

  // ?.logs.find(log => log.log_ids_with_notes.find(note => note.id == expandedStepId))
  // ?.log_ids_with_notes.find(note => note.id == expandedStepId)|| ""
  console.log(stepNoteFromDailyLogsTimeline, "stepnoteFromDailyLogsTimeline", expandedStepId)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <Label className="text-base font-semibold">Daily Steps</Label>
        <span className="text-sm text-muted-foreground">
          {steps.filter((s) => s.completed).length}/{steps.length} completed
        </span>
      </div>

      {steps.map((step, idx) => (
        <Card key={step.id} className={step.completed ? "bg-accent/5" : ""}>
          <CardContent className="p-4">
            <div
              onClick={() => setExpandedStepId(expandedStepId === step.id ? null : step.id)}
              className="flex items-center gap-4 cursor-pointer"
            >
              <Checkbox
                checked={step.completed}
                // checked={stepChecked}
                onCheckedChange={() => handleToggleStep(step.id)}
                // onCheckedChange={() => {
                //   if (dateFilteredLogs.length) {
                //     setStepChecked(v => !v)
                //   } else {
                //     handleToggleStep(step.id)
                //   }
                // }}
                className="w-5 h-5"
              />

              <div className="flex-1">
                <p className={`font-semibold ${step.completed ? "line-through text-muted-foreground" : ""}`}>
                  {idx + 1}. {step.title}
                </p>
                <p className="text-sm text-muted-foreground">⏰ {step.time}</p>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${expandedStepId === step.id ? "rotate-180" : ""
                  }`}
              />
            </div>

            {/* Expanded Details */}
            {expandedStepId === step.id && (
              <div className="mt-4 pt-4 border-t space-y-4">
                {/* Notes */}
                <div>
                  <Label htmlFor={`notes-${step.id}`} className="text-sm">
                    Notes
                  </Label>
                  <Textarea
                    id={`notes-${step.id}`}
                    placeholder="Add notes about this step..."
                    value={stepNote || step.notes || ""}
                    // onChange={(e) => handleUpdateStep(step.id, "notes", e.target.value)}
                    onChange={(e) => {
                      if (stepNote) {
                        setStepNote(e.target.value)
                      } else {
                        handleUpdateStep(step.id, "notes", e.target.value)
                      }
                    }}
                    className="mt-1.5 min-h-20 resize-none"
                  />
                </div>

                {/* Media Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Camera className="w-4 h-4 mr-2" />
                    Add Photo
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Mic className="w-4 h-4 mr-2" />
                    Voice Note
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
