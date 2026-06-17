"use client"

import { useEffect, useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent } from "../../../../components/ui/card"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import { Checkbox } from "../../../../components/ui/checkbox"
import { ChevronDown, Mic, Camera } from "lucide-react"

interface Step {
  id: string
  title: string
  time: string
  completed: boolean
  notes: string
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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <Label className="text-base font-semibold">Daily Steps</Label>
        <span className="text-sm text-muted-foreground">
          {steps.filter((s) => s.completed).length}/{steps.length} completed
        </span>
      </div>

      {steps.map((step, idx) => (
        <StepLog
          key={step.id}
          step={step}
          date={date}
          expandedStepId={expandedStepId}
          setExpandedStepId={setExpandedStepId}
          handleToggleStep={handleToggleStep}
          handleUpdateStep={handleUpdateStep}
          idx={idx}
        />
      ))}
    </div>
  )
}

type StepLogProps = {
  step: Step,
  expandedStepId: string | null, setExpandedStepId: (id: string | null) => void,
  handleToggleStep: (id: string) => void,
  handleUpdateStep: (id: string, field: string, value: any) => void,
  idx: number, date: Date | undefined
}


const StepLog = ({ step, expandedStepId, setExpandedStepId, handleToggleStep, handleUpdateStep, idx, date }: StepLogProps) => {
  useEffect(() => {
    setExpandedStepId(step.id)
  }, [])

  return (
    <Card
      className={step?.completed ? "bg-accent/5" : ""}
    >
      <CardContent className="p-4">
        <div
          className="flex items-center gap-4 cursor-pointer"
        >
          <Checkbox
            checked={step.completed}

            onCheckedChange={() => {
              handleToggleStep(step.id)
            }}
            className="w-5 h-5"
          />

          <div
            className="flex-1"
            onClick={() => setExpandedStepId(expandedStepId === step.id ? null : step.id)}
          >
            <p
              className={`font-semibold ${step.completed ? "line-through text-muted-foreground" : ""}`}
            >
              {idx + 1}. {step.title}
            </p>
            <p className="text-sm text-muted-foreground">⏰ {step.time}</p>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${expandedStepId === step.id ? "rotate-180" : ""}`}
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
                id={`${step.id}`}
                placeholder="Add notes about this step..."
                value={step.notes || ""}
                onChange={(e) => {
                  handleUpdateStep(step.id, "notes", e.target.value)
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
  )
}