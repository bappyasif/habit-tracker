"use client"

import { useEffect, useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { TrackTypes, useTrackCtx } from "@/context-reducers/trackCtx"
import { HabitPreview } from "./habit-preview"
import { HabitEdit } from "./habit-edit"
import { NewHabit } from "./new-habit"
import { useToFetchInsights } from "@/hooks/use-to-fetch-insights"

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
  onSave: (habit: TrackTypes) => void
}

export function HabitCreationModal({ onClose, onSave }: HabitCreationModalProps) {
  const [stage, setStage] = useState<"preview" | "edit" | "new">("preview")
  const [isLoading, setIsLoading] = useState(false)

  const { state: trackState, dispatch: trackDispatch } = useTrackCtx()

  // const [tempSteps, setTempSteps] = useState<Step[]>(trackState.habitViewing !== -1 ? trackState.habits[trackState.habitViewing - 1].steps : [])

  const [tempHabit, setTempHabit] = useState(trackState.habits[trackState.habitViewing - 1])

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
    const newStep: Step = {
      // id: 's4',
      id: (habit.steps.length + 1).toString(),
      title: "New step",
      time: "06:00",
      completed: false,
    }

    trackDispatch({
      type: 'ADD_A_HABIT_STEP',
      payload: {
        habitId: habit.id,
        newStep
      }
    })
  }

  const handleRemoveStep = (id: string) => {
    trackDispatch({
      type: 'UPDATE_HABIT_PAYLOAD',
      payload: {
        id: habit.id,
        data: {
          steps: habit.steps.filter((s) => s.id !== id),
        }
      }
    })
  }

  const handleUpdateStep = (id: string, field: string, value: any) => {
    trackDispatch({
      type: 'UPDATE_HABIT_PAYLOAD',
      payload: {
        id: habit.id,
        data: {
          steps: habit.steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
        }
      }
    })
  }

  const { fetchAiInsightsData } = useToFetchInsights()

  const handleRegenerateWithAI = async () => {
    setIsLoading(true)

    const props = { title: habit?.title || "", steps: habit?.steps || [], totalCompleted: habit?.totalCompleted || 0 }

    fetchAiInsightsData(props)
      .then(async (data) => {
        setIsLoading(false)
        console.log(data, "AI insights data")
      })
  }

  const handleSave = () => {
    onClose()

    // trackDispatch({
    //   type: "UPDATE_HABIT",
    //   // payload: habit
    //   payload: tempHabit
    // })
    onSave(tempHabit)
  }

  const habit = trackState.habits[trackState.habitViewing - 1]

  const checkDailyStepsExists = trackState.habitInsights?.find(insight => insight.habitId === trackState.habitViewing)?.daily

  useEffect(() => {
    if (trackState.habitViewing === -1) {
      setStage("new")
    }

  }, [trackState.habitViewing])

  useEffect(() => {
    const ts = trackState.habitViewing === -1
      ? [{ label: "New", value: "new" }] : [{ label: "Preview", value: "preview" }, { label: "Edit", value: "edit" }]

    setTabs(ts)

  }, [trackState.habitViewing])

  // useEffect(() => {
  //   if (!checkDailyStepsExists?.length) {
  //     const ts = trackState.habitViewing === -1
  //       ? [{ label: "New", value: "new" }] : [{ label: "Preview", value: "preview" }, { label: "Edit", value: "edit" }]

  //     setTabs(ts)
  //   } else {
  //     // setTabs([{ label: "Edit", value: "edit" }])
  //     setStage("edit")
  //   }

  // }, [trackState.habitViewing])

  // useEffect(() => {
  //   const checkDailyStepsExists = trackState.habitInsights?.find(insight => insight.habitId === trackState.habitViewing)?.daily

  //   if (checkDailyStepsExists?.length) {
  //     setTempSteps(steps => [...steps, ...checkDailyStepsExists])
  //   }

  // }, [trackState.habitInsights])

  useEffect(() => {
    // const checkDailyStepsExists = trackState.habitInsights?.find(insight => insight.habitId === trackState.habitViewing)?.daily

    if (checkDailyStepsExists?.length) {
      setTempHabit(habit => ({ ...habit, steps: [...checkDailyStepsExists] }))

      // setTempHabit(habit => ({ ...habit, steps: [...habit.steps, ...checkDailyStepsExists] }))

      // setTabs(tabs => [...tabs, { label: "Edit", value: "edit" }])

      setTabs([{ label: "Edit", value: "edit" }])
      setStage("edit")
    }
  }, [trackState.habitInsights])


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
                : tabs.map(
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
          </div>

          {
            stage === "preview" && habit ? (
              <HabitPreview
                // habit={habit}
                habit={tempHabit}
                handleRegenerateWithAI={handleRegenerateWithAI}
                isLoading={isLoading}
                setStage={setStage}
              />
            ) : stage === "edit" && habit ? (
              // Edit Stage
              <HabitEdit
                // habit={habit}
                habit={tempHabit}
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
                    Cancel!!
                  </Button>
                  <Button onClick={handleSave} className="flex-1">
                    Save Habit
                  </Button>
                </div>
              )
          }
        </CardContent>
      </Card>
    </div>
  )
}
