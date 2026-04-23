"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardTabs } from "@/app/(nested-navs)/dashboard/_components/dashboard-tabs"
import { AIInsightsCard } from "@/app/(nested-navs)/dashboard/_components/ai-insights-card"
import { mockHabits, mockInsights } from "@/lib/mock-data"
import Link from "next/link"
import { Plus, Pencil, Trash, Sparkles, ArrowRight } from "lucide-react"
import { TrackTypes, useTrackCtx } from "@/context-reducers/trackCtx"
import { TodaysFocus } from "./_components/todays-focus"
import { useToFetchHabits } from "./_hooks/fetchHabits"
import { useRouter } from "next/navigation"
import { deleteHabit } from "@/server-calls/habits"
import { useToFetchHabitDailyTimeline } from "./_hooks/fetchHabitDailyTimeline"

export default function DashboardPage() {
  const [selectedHabitId, setSelectedHabitId] = useState("")

  const { dispatch, state } = useTrackCtx()

  // fetching habits from server
  useToFetchHabits()

  // fetching habit daily timeline from server
  useToFetchHabitDailyTimeline()

  useEffect(() => {
    if (!selectedHabitId) return
    dispatch({
      type: 'UPDATE_HABIT_VIEWING',
      payload: Number(selectedHabitId)
    })
  }, [selectedHabitId, state.habits])

  const router = useRouter()

  const gotoCreateNewHabit = () => {
    alert("No habits available lets create one")
    router.push("/create-habit")
  }

  const deleteHabitFromDb = async (id: string) => {
    const res = await deleteHabit(id)
    console.log(res, "deleted habit")
  }

  if (!state.habits?.length) return null

  const habit = state.habits.find(habit => Number(habit.id) === state.habitViewing)

  if (!habit) return <WhenEmpty />

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Good morning, Alex</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          <TodaysFocus selectedHabitId={selectedHabitId} />

          <h2 className="text-3xl font-bold my-10">Snapshots of your habits</h2>

          {/* Dashboard Tabs */}
          <DashboardTabs selectedHabitId={selectedHabitId} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Habits List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Habits</CardTitle>
                <Link href="/create-habit" onClick={() => {
                  dispatch({
                    type: 'UPDATE_HABIT_VIEWING',
                    payload: -1
                  })
                }}>
                  <Button size="sm" variant="ghost">
                    <Plus className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {state.habits.map((habit) => (
                  <div key={habit.id} className="relative flex flex-col self-center justify-center">
                    <button
                      onClick={() => setSelectedHabitId(habit.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${selectedHabitId === habit.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                        }`}
                    >
                      <p className="font-semibold text-sm">{habit.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">🔥 {habit.currentStreak} day streak</p>
                    </button>

                    <div className="absolute right-1.5 bg-secondary min-w-1/4 h-9 flex gap-2 items-center justify-evenly text-primary rounded">
                      <Link
                        className="p-2 bg-secondary rounded-full flex gap-2 items-center justify-center text-primary hover:text-secondary hover:bg-primary transition-colors px-2.5"
                        href="/create-habit"
                        onClick={() => {
                          dispatch({ type: "UPDATE_HABIT_VIEWING", payload: habit.id })
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                        {/* <span>Edit</span> */}
                      </Link>
                      <Button
                        onClick={() => {
                          if (Number(habit.id) == state.habitViewing) {
                            const fh = state.habits.filter(habit => Number(habit.id)
                              !== state.habitViewing)[0]
                                                        
                              deleteHabitFromDb(habit.id)
                            if (!fh?.id) {
                              gotoCreateNewHabit()
                              dispatch({
                                type: 'UPDATE_HABIT_VIEWING',
                                payload: -1
                              })
                              return
                            }
                            setSelectedHabitId(fh.id)
                            dispatch({ type: "UPDATE_HABIT_VIEWING", payload: fh.id })
                            dispatch({ type: "DELETE_HABIT", payload: habit.id })
                          } else {
                            deleteHabitFromDb(habit.id)
                            dispatch({ type: "DELETE_HABIT", payload: habit.id })
                          }
                        }}
                        className="bg-secondary w-1/4 h-9 px-2.5 rounded-full flex gap-2 items-center justify-center text-primary hover:bg-destructive transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <AIInsightsCard
            weeklyText={mockInsights.weeklyText}
            suggestions={mockInsights.suggestions}
            onAdjustPlan={() => console.log("Adjust plan")}
          />

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 bg-accent/10 rounded-lg text-sm">
                <p className="font-semibold text-accent mb-1">Daily Goal Reminder</p>
                <p className="text-xs text-muted-foreground">You have {habit.steps.filter(step => !step.completed).length} habits to complete today</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <p className="font-semibold mb-1">Weekly Review</p>
                <Link href="/reports" className="text-primary hover:underline">
                  <p className="text-xs text-muted-foreground">Check your progress report</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

const WhenEmpty = () => {
  return (
    <div
      className="flex flex-col min-w-3/4 gap-40"
    >
      <header
        className="mb-40 flex flex-col self-start m-10"
      >
        <h1 className="text-4xl font-bold mb-2">Good morning </h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>
      <main
      className="self-end flex flex-col gap-4 mr-20"
      >
        <div className="flex flex-col items-start justify-start gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold text-primary">Welcome To HabitFlow Dashboard</h2>
          <p className="text-muted-foreground">Start tracking your habits now!</p>
          <Link href="/create-habit" className="mt-4">
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 cursor-pointer">
              Create Habit
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}