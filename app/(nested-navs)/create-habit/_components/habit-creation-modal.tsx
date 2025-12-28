"use client"

import { useEffect, useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Switch } from "../../../../components/ui/switch"
import { Plus, Trash2, Wand2 } from "lucide-react"
import { useHabitCtx } from "@/context-reducers/habitCtxr"

interface Step {
  id: string
  title: string
  time: string
  completed: boolean
}

interface HabitCreationForm {
  id: string
  title: string
  frequency: "daily" | "weekly" | "monthly"
  duration: number
  steps: Step[]
  metric: string
  target: number
  successPercentage: number
  successEnabled: boolean
}

interface HabitCreationModalProps {
  onClose: () => void
  onSave: (habit: HabitCreationForm) => void
}

export function HabitCreationModal({ onClose, onSave }: HabitCreationModalProps) {
  const [stage, setStage] = useState<"preview" | "edit">("preview")
  const [isLoading, setIsLoading] = useState(false)
  // const [form, setForm] = useState<HabitCreationForm>({
  //   title: "Morning Workout",
  //   frequency: "daily",
  //   duration: 30,
  //   steps: [
  //     { id: "1", title: "Warm up", time: "06:00", completed: false },
  //     { id: "2", title: "Main exercise", time: "06:15", completed: false },
  //     { id: "3", title: "Cool down", time: "06:45", completed: false },
  //   ],
  //   metric: "minutes",
  //   target: 30,
  //   successPercentage: 80,
  //   successEnabled: true,
  // })

  const handleAddStep = () => {
    const newStep: Step = {
      id: Math.random().toString(),
      title: "New step",
      time: "06:00",
      completed: false,
    }
    // setForm({
    //   ...form,
    //   steps: [...form.steps, newStep],
    // })
  }

  const handleRemoveStep = (id: string) => {
    // setForm({
    //   ...form,
    //   steps: form.steps.filter((s) => s.id !== id),
    // })
  }

  const handleUpdateStep = (id: string, field: string, value: any) => {
    // setForm({
    //   ...form,
    //   steps: form.steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    // })
  }

  const handleRegenerateWithAI = async () => {
    setIsLoading(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 800))
    // setForm({
    //   ...form,
    //   steps: [
    //     { id: "1", title: "Meditation", time: "06:00", completed: false },
    //     { id: "2", title: "Cardio", time: "06:15", completed: false },
    //     { id: "3", title: "Strength Training", time: "06:35", completed: false },
    //     { id: "4", title: "Stretching", time: "06:55", completed: false },
    //   ],
    // })
    setIsLoading(false)
  }

  const handleSave = () => {
    // onSave(form)
    onClose()

    // testing!!
    onSave({
        // id: Math.random().toString(),
        id: "4",
        title: "Morning Workout>>><<<<",
        frequency: "daily",
        duration: 30,
        steps: [
          { id: "1", title: "Warm up", time: "06:00", completed: false },
          { id: "2", title: "Main exercise", time: "06:15", completed: false },
          { id: "3", title: "Cool down", time: "06:45", completed: false },
        ],
        metric: "minutes",
        target: 30,
        successPercentage: 80,
        successEnabled: true,
      })
  }

  const { state, dispatch } = useHabitCtx()

  useEffect(() => {
    // dispatch({type: "CREATE_HABIT", payload: form})
    dispatch({
      type: "CREATE_HABIT", payload: {
        title: "Morning Workout>>><<<<",
        frequency: "daily",
        duration: 30,
        steps: [
          { id: "1", title: "Warm up", time: "06:00", completed: false },
          { id: "2", title: "Main exercise", time: "06:15", completed: false },
          { id: "3", title: "Cool down", time: "06:45", completed: false },
        ],
        metric: "minutes",
        target: 30,
        successPercentage: 80,
        successEnabled: true,
      }
    })
  }, [])

  console.log(state)


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-card border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create New Habit</CardTitle>
              <CardDescription>
                {stage === "preview" ? "Review your habit plan before saving" : "Edit your habit details"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Stage Tabs */}
          <div className="flex gap-2 mb-6">
            <Button variant={stage === "preview" ? "default" : "outline"} size="sm" onClick={() => setStage("preview")}>
              Preview
            </Button>
            <Button variant={stage === "edit" ? "default" : "outline"} size="sm" onClick={() => setStage("edit")}>
              Edit Details
            </Button>
          </div>

          {stage === "preview" ? (
            // Preview Stage
            <div className="space-y-6">
              {/* Habit Title */}
              <div>
                <h3 className="text-2xl font-bold mb-2">{state.title}</h3>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>📅 {state.frequency.charAt(0).toUpperCase() + state.frequency.slice(1)}</span>
                  <span>⏱️ {state.duration} days</span>
                  <span>
                    🎯 {state.target} {state.metric}
                  </span>
                </div>
              </div>

              {/* Daily Steps */}
              <div>
                <h4 className="font-semibold mb-3">Daily Steps</h4>
                <div className="space-y-2 bg-muted/30 rounded-lg p-4">
                  {state.steps.map((step, idx) => (
                    <div key={step.id} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {idx + 1}. {step.title}
                        </p>
                        <p className="text-xs text-muted-foreground">⏰ {step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Measurement */}
              <div>
                <h4 className="font-semibold mb-2">Measurement</h4>
                <p className="text-sm text-muted-foreground">
                  Target:{" "}
                  <span className="font-semibold text-foreground">
                    {state.target} {state.metric}
                  </span>
                </p>
              </div>

              {/* Success Definition */}
              {state.successEnabled && (
                <div className="bg-accent/10 rounded-lg p-4">
                  <p className="text-sm font-semibold text-accent-foreground">
                    Success Definition: {state.successPercentage}% completion
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleRegenerateWithAI}
                  disabled={isLoading}
                  className="flex-1 bg-transparent"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isLoading ? "Regenerating..." : "Edit with AI"}
                </Button>
                <Button onClick={() => setStage("edit")} variant="outline" className="flex-1">
                  Manual Edit
                </Button>
              </div>
            </div>
          ) : (
            // Edit Stage
            <div className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Habit Title</Label>
                <Input
                  id="title"
                  value={state.title}
                  // onChange={(e) => setForm({ ...form, title: e.target.value })}
                  onChange={(e) => {
                    dispatch({ type: "UPDATE_TITLE", payload: e.target.value })
                  }}
                  placeholder="e.g., Morning Workout"
                  className="mt-1.5"
                />
              </div>

              {/* Frequency and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Frequency</Label>
                  <Select 
                  value={state.frequency} 
                  // onValueChange={(v: any) => setForm({ ...form, frequency: v })}
                  onValueChange={(v: any) => {
                    dispatch({ type: "UPDATE_FREQUENCY", payload: v })
                  }}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={state.duration}
                    // onChange={(e) => setForm({ ...form, duration: Number.parseInt(e.target.value) })}
                    onChange={(e) => {
                      dispatch({ type: "UPDATE_DURATION", payload: Number.parseInt(e.target.value) })
                    }}
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Steps */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Daily Steps</Label>
                  <Button size="sm" variant="outline" onClick={handleAddStep}>
                    <Plus className="w-4 h-4 mr-1" /> Add Step
                  </Button>
                </div>
                <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                  {state.steps.map((step, idx) => (
                    <div key={step.id} className="flex items-center gap-2 bg-card p-3 rounded-lg border">
                      <span className="text-sm font-semibold text-muted-foreground min-w-6">{idx + 1}.</span>
                      <Input
                        placeholder="Step title"
                        value={step.title}
                        onChange={(e) => handleUpdateStep(step.id, "title", e.target.value)}
                        className="flex-1 h-8"
                      />
                      <Input
                        type="time"
                        value={step.time}
                        onChange={(e) => handleUpdateStep(step.id, "time", e.target.value)}
                        className="w-24 h-8"
                      />
                      <Button size="sm" variant="ghost" onClick={() => handleRemoveStep(step.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Measurement */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metric">Metric</Label>
                  <Input
                    id="metric"
                    value={state.metric}
                    // onChange={(e) => setForm({ ...form, metric: e.target.value })}
                    onChange={(e) => {
                      dispatch({ type: "UPDATE_METRIC", payload: e.target.value })
                    }}
                    placeholder="e.g., minutes"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="target">Target</Label>
                  <Input
                    id="target"
                    type="number"
                    value={state.target}
                    // onChange={(e) => setForm({ ...form, target: Number.parseInt(e.target.value) })}
                    onChange={(e) => {
                      dispatch({ type: "UPDATE_TARGET", payload: Number.parseInt(e.target.value) })
                    }}
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Success Definition */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Enable Success Definition</Label>
                  <Switch
                    checked={state.successEnabled}
                    // onCheckedChange={(checked) => setForm({ ...form, successEnabled: checked })}
                    onCheckedChange={(checked) => {
                      dispatch({ type: "UPDATE_SUCCESS_ENABLED", payload: checked })
                    }}
                  />
                </div>
                {state.successEnabled && (
                  <div>
                    <Label htmlFor="success">Success Percentage</Label>
                    <Input
                      id="success"
                      type="number"
                      min="0"
                      max="100"
                      value={state.successPercentage}
                      // onChange={(e) => setForm({ ...form, successPercentage: Number.parseInt(e.target.value) })}
                      onChange={(e) => {
                        dispatch({ type: "UPDATE_SUCCESS_PERCENTAGE", payload: Number.parseInt(e.target.value) })
                      }}
                      className="mt-1.5"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-6 border-t mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Habit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
