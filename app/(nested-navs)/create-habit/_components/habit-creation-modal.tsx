"use client"

import { useEffect, useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { TrackTypes, useTrackCtx } from "@/context-reducers/trackCtx"
import { HabitPreview } from "./habit-preview"
import { HabitEdit } from "./habit-edit"
import { NewHabit } from "./new-habit"
import { useToFetchInsights } from "@/hooks/use-to-fetch-insights"
import { createHabitSecurely, updateHabitSecurely } from "@/server-calls/habits"
import Link from "next/link"
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { sendPushNotificationsToUserWhenCreatedNewHabit, sendPushNotificationsToUserWhenUpdatedHabit } from "@/app/server-actions/notifications"
import { useToFetchNotifications } from "@/hooks/useToFetchNotifications"

interface Step {
  id: string
  title: string
  time: string
  completed: boolean
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
        console.log("AI insights data")
      })
  }

  const { state: authState } = useUserAuthCtx()

  const saveToDb = (habitData: TrackTypes) => {
    const userId = authState.user?.id!
    const token = authState.user?.token!
    const updatedData = { ...habitData, userId, token }

    createHabitSecurely(updatedData).then(data => {
      console.log("created habit")
      if (data) {
        // lets show a notification to user that habit is created successfully
        sendPushNotificationsToUserWhenCreatedNewHabit(token)
        .then(res => {
          console.log(res)
          fetchNotifications(token)
        }).catch(err => console.log(err))
        onSave(habitData)
      }
    }).catch(err => console.log(err))
  }

  const handleSave = () => {
    onClose()
    saveToDb(habit)
  }

  const {fetchNotifications} = useToFetchNotifications()

  const handleUpdate = () => {
    // alert("update")

    // need convert habit steps time to date time string before saving to db, currently steps time is in "HH:mm" format which is good for displaying and editing in UI but when saving to db we want to convert it to date time string so that we can use it for daily timeline and insights generation
    const convertedSteps = habit.steps.map(step => {
      // 1. Clean the string: Remove AM/PM and trim spaces
      const cleanTime = step.time.replace(/(AM|PM)/gi, '').trim();

      // 2. Split and parse numbers safely
      const [hoursStr, minutesStr] = cleanTime.split(":");
      let hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);

      // 3. Convert 12h to 24h format
      const isPM = step.time.toUpperCase().includes("PM");
      const isAM = step.time.toUpperCase().includes("AM");

      if (isPM && hours < 12) hours += 12; // 1 PM -> 13
      if (isAM && hours === 12) hours = 0; // 12 AM -> 0

      // 4. Set time safely
      const date = new Date();
      date.setHours(hours, minutes, 0, 0); // Set hours, mins, secs, ms

      return { ...step, time: date.toISOString() };
    });

    const token = authState?.user?.token!
    const userId = authState?.user?.id!

    const updatedHabit = { ...habit, steps: convertedSteps, token, userId };

    updateHabitSecurely(updatedHabit).then(data => {
      // lets send a notification to user that habit is updated successfully
      sendPushNotificationsToUserWhenUpdatedHabit(authState?.user?.token!)
      .then(res => {
        // console.log(res)
        fetchNotifications(authState?.user?.token!)        
      })
      .catch(err => console.log(err))
      onSave(updatedHabit)
    })
    onClose()
    // cleaning out old insights data for the habit being updated, we can choose to keep old insights data or not after update, if we want to keep then we can remove this dispatch call
    trackDispatch({
      type: "DELETE_INSIGHTS_FOR_HABIT",
      payload: {
        habitId: trackState.habitViewing
      }
    })
  }

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

  const onlyIncludeStepWithUniqueIds = (oldSteps: Step[], newSteps: Step[]) => {
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

      const reassignIdsForAiSuggestedDailySteps = checkDailyStepsExists.map(step => ({ ...step, id: crypto.randomUUID() }))

      habit.steps = onlyIncludeStepWithUniqueIds(habit.steps, reassignIdsForAiSuggestedDailySteps)
    }
  }, [checkDailyStepsExists])

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
                  <Link href="/dashboard" className="flex-1 w-full bg-primary/10 text-primary rounded-md flex items-center justify-center hover:bg-primary/20 transition cursor-pointer font-semibold py-2" onClick={handleClose}>
                    Cancel
                  </Link>
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
