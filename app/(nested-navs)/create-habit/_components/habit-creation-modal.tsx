"use client"

import { useEffect, useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { useTrackCtx } from "@/context-reducers/trackCtx"
import { HabitPreview } from "./habit-preview"
import { HabitEdit } from "./habit-edit"
import { NewHabit } from "./new-habit"

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
  const [stage, setStage] = useState<"preview" | "edit" | "new">("preview")
  const [isLoading, setIsLoading] = useState(false)
  const { state: trackState, dispatch: trackDispatch } = useTrackCtx()
  const [tabs, setTabs] = useState<{
    label: string;
    value: string;
  }[]>([])

  const handleClose = () => {
    onClose()
    trackDispatch({
      type: "UPDATE_HABIT_VIEWING",
      payload: -1
    })
  }

  const handleAddStep = () => {
    // const newStep: Step = {
    //   id: Math.random().toString(),
    //   title: "New step",
    //   time: "06:00",
    //   completed: false,
    // }

    const newStep: Step = {
      id: 's4',
      title: "New step",
      time: "06:00",
      completed: false,
    }

    trackDispatch({
      type: 'UPDATE_HABIT_PAYLOAD',
      payload: {
        id: '4',
        steps: [habit.steps, newStep]
      }
    })

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

    // console.log({
    //     id: habit.id,
    //     data: {
    //       steps: habit.steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    //     }
    //   }, "handleUpdateStep")

    trackDispatch({
      type: 'UPDATE_HABIT_PAYLOAD',
      payload: {
        id: habit.id,
        data: {
          steps: habit.steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
        }
      }
    })
    // trackDispatch({
    //   type: 'UPDATE_HABIT_PAYLOAD',
    //   payload: {
    //     id: id,
    //     data: {
    //       [field]: value
    //     }
    //   }
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

    trackDispatch({
      type: "UPDATE_HABIT",
      payload: habit
    })

    // testing!!
    // onSave({
    //   // id: Math.random().toString(),
    //   id: "4",
    //   title: "Morning Workout>>><<<<",
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
  }

  const habit = trackState.habits[trackState.habitViewing - 1]

  useEffect(() => {
    if (trackState.habitViewing === -1) {
      setStage("new")

      console.log("RUNNING!! NOTTTT")
    }

    console.log("RUNNING!!")
  }, [trackState.habitViewing])

  // if(!habit) return (
  //   <NewHabit />
  // )

  // const tabs = trackState.habitViewing === -1 ? [{ label: "Preview", value: "preview" }, { label: "New", value: "new" }] : [{ label: "Preview", value: "preview" }, { label: "Edit", value: "edit" }, { label: "New", value: "new" } ]

  useEffect(() => {
    const ts = trackState.habitViewing === -1
      ? [{ label: "New", value: "new" }] : [{ label: "Preview", value: "preview" }, { label: "Edit", value: "edit" }]

    setTabs(ts)

  }, [trackState.habitViewing])


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-card border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{habit ? "Edit Current Habit" : "Create New Habit"}</CardTitle>
              <CardDescription>
                {stage === "preview" ? "Review your habit plan before saving" : "Edit your habit details"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Stage Tabs */}
          <div className="flex gap-2 mb-6">
            {
              trackState.habitViewing === -1
              ? null
              :tabs.map(
                (tab) => (
                  <Button
                    key={tab.value}
                    variant={stage === tab.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStage(tab.value as typeof stage)}
                  >
                    {tab.label}
                  </Button>
                ))
            }
            {/* <Button variant={stage === "preview" ? "default" : "outline"} size="sm" onClick={() => setStage("preview")}>
              Preview
            </Button>
            <Button variant={stage === "edit" ? "default" : "outline"} size="sm" onClick={() => setStage("edit")}>
              Edit Details
            </Button>
            <Button variant={stage === "new" ? "default" : "outline"} size="sm" onClick={() => setStage("new")}>
              Create New
            </Button> */}
          </div>

          {
            stage === "preview" && habit ? (
              <HabitPreview
                habit={habit}
                // onSave={onSave}
                // onClose={}
                handleRegenerateWithAI={handleRegenerateWithAI}
                isLoading={isLoading}
                setStage={setStage}
              />
            ) : stage === "edit" && habit ? (
              // Edit Stage
              <HabitEdit
                habit={habit}
                handleAddStep={handleAddStep}
                handleUpdateStep={handleUpdateStep}
                handleRemoveStep={handleRemoveStep}
              />
            ) : stage === "new" && (
              // New Stage
              <NewHabit />
            )
          }

          {/* Footer Buttons */}
          {
            trackState.habitViewing === -1
              ? null
              : (
                <div className="flex gap-3 pt-6 border-t mt-6">
                  <Button variant="outline"
                    onClick={handleClose}
                    className="flex-1 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="flex-1">
                    Save Habit
                  </Button>
                </div>
              )
          }
          {/* <div className="flex gap-3 pt-6 border-t mt-6">
            <Button variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Habit
            </Button>
          </div> */}
        </CardContent>
      </Card>
    </div>
  )
}
