"use client"

import { useEffect, useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { TrackTypes, useTrackCtx } from "@/context-reducers/trackCtx"
import { HabitPreview } from "./habit-preview"
import { HabitEdit } from "./habit-edit"
import { NewHabit } from "./new-habit"
import { useToFetchInsights } from "@/hooks/use-to-fetch-insights"
import { createHabit, updateHabit } from "@/server-calls/habits"

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

  const habit = trackState.habits.find((habit) => Number(habit.id) === trackState.habitViewing) ?? trackState.habits[0]

  const [tempHabit, setTempHabit] = useState<TrackTypes>(habit)

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

    trackDispatch({
      type: "DELETE_INSIGHTS_FOR_HABIT",
      payload: {
        habitId: trackState.habitViewing
      }
    })
  }

  const handleAddStep = () => {
    const newStep: Step = {
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

  const saveToDb = (habitData: TrackTypes) => {
    createHabit(habitData).then(data => {
      console.log(data, "created habit")
      if(data) {
        onSave(habitData)
      }
    }).catch(err => console.log(err))
  }

  const handleSave = () => {
    onClose()
    saveToDb(habit)
  }

  const handleUpdate = () => {
    alert("update")
    updateHabit(habit)
    onClose()
  }

  const checkDailyStepsExists = trackState.habitInsights?.find(insight => insight.habitId === trackState.habitViewing)?.daily

  console.log(checkDailyStepsExists, "checkDailyStepsExists")

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

  // const [steps, setSteps] = useState<Step[]>(habit.steps || [])

  const onlyIncludeStepWithUniqueIds = (oldSteps:Step[], newSteps:Step[]) => {
    const freshStpes = oldSteps

    newSteps.forEach((step) => {
      if (!freshStpes.find((freshStep) => freshStep.id === step.id || freshStep.title === step.title)) {
        freshStpes.push(step)
      }
    })

    return freshStpes

  }

  useEffect(() => {

    if (checkDailyStepsExists?.length) {
      setTempHabit(habit => ({ ...habit, steps: [...checkDailyStepsExists] }))
      setTabs([{ label: "Edit", value: "edit" }])
      setStage("edit")

      // setSteps(prev => [...prev, ...checkDailyStepsExists])
      // setSteps(checkDailyStepsExists)
      
      // habit.steps = checkDailyStepsExists

      const reassignIdsForAiSuggestedDailySteps = checkDailyStepsExists.map(step => ({ ...step, id: crypto.randomUUID() }))
      // habit.steps = reassignIdsForAiSuggestedDailySteps

      habit.steps = onlyIncludeStepWithUniqueIds(habit.steps, reassignIdsForAiSuggestedDailySteps)

      console.log(habit.steps, "habit.steps")
    }
  }, [checkDailyStepsExists])

  // console.log(steps, "steps")

  // const test = [...habit?.steps, ...checkDailyStepsExists! || []]

  // habit.steps = test

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
                habit={tempHabit}
                handleRegenerateWithAI={handleRegenerateWithAI}
                isLoading={isLoading}
                setStage={setStage}
              />
            ) : stage === "edit" && habit ? (
              // Edit Stage
              <HabitEdit
                habit={habit}
                // habit={tempHabit}
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
                    [Cancel]
                  </Button>
                  <Button 
                    onClick={stage === "edit" ? handleUpdate : handleSave}
                    className="flex-1"
                  >
                    {stage === "edit" ? "Update" : "Save"} Habit
                  </Button>
                </div>
              )
          }
        </CardContent>
      </Card>
    </div>
  )
}
