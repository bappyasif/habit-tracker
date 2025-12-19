"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardTabs } from "@/app/dashboard/_components/dashboard-tabs"
import { AIInsightsCard } from "@/app/dashboard/_components/ai-insights-card"
import { ProgressRing } from "@/app/dashboard/_components/progress-ring"
import { mockHabits, mockInsights } from "@/lib/mock-data"
import Link from "next/link"
import { Plus, CheckCircle2 } from "lucide-react"
import { TrackTypes, useTrackCtx } from "@/context-reducers/trackCtx"

export default function DashboardPage() {
  // const [habits, setHabits] = useState(mockHabits)
  const [habits, setHabits] = useState<TrackTypes[]>([])
  const [selectedHabitId, setSelectedHabitId] = useState(habits[0]?.id)

  const currentHabit = habits.find((h) => h?.id === selectedHabitId) || habits[0]

  const {dispatch, state} = useTrackCtx()

  useEffect(() => {
    mockHabits.forEach((habit) => {
      dispatch({type: "CREATE_HABIT", payload: habit})
    })

    setHabits(state.habits)
  }, [])

  if (!habits.length) return null

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
          {/* Active Habit Card */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Today's Focus: {currentHabit.title}</CardTitle>
              <CardDescription>Complete your habit and build momentum</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <ProgressRing
                  percentage={Math.round(
                    (currentHabit.steps.filter((s) => s.completed).length / currentHabit.steps.length) * 100,
                  )}
                />
                <div className="flex-1 ml-6">
                  <h3 className="font-semibold mb-4">Next Step</h3>
                  {currentHabit.steps.find((s) => !s.completed) ? (
                    <div className="space-y-2">
                      <p className="text-lg font-bold">{currentHabit.steps.find((s) => !s.completed)?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        ⏰ {currentHabit.steps.find((s) => !s.completed)?.time}
                      </p>
                    </div>
                  ) : (
                    <p className="text-lg font-bold text-accent">All done for today! 🎉</p>
                  )}
                </div>
              </div>
              <Link href="/track">
                <Button className="w-full">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Log Progress
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Dashboard Tabs */}
          <DashboardTabs habitTitle={currentHabit.title} currentStreak={currentHabit.currentStreak} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Habits List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Habits</CardTitle>
                <Link href="/create-habit">
                  <Button size="sm" variant="ghost">
                    <Plus className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {habits.map((habit) => (
                  <button
                    key={habit.id}
                    onClick={() => setSelectedHabitId(habit.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${selectedHabitId === habit.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                      }`}
                  >
                    <p className="font-semibold text-sm">{habit.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">🔥 {habit.currentStreak} day streak</p>
                  </button>
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
                <p className="text-xs text-muted-foreground">You have 3 habits to complete today</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <p className="font-semibold mb-1">Weekly Review</p>
                <p className="text-xs text-muted-foreground">Check your progress report</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
