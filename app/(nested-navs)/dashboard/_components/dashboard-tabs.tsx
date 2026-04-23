"use client"

import { useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useTrackCtx } from "@/context-reducers/trackCtx"
import { useToUpdateHabitStepsCompletion } from "../_hooks/useToUpdateHabitStepsCompletion"

const weekData = [
  { day: "Mon", completion: 75 },
  { day: "Tue", completion: 85 },
  { day: "Wed", completion: 65 },
  { day: "Thu", completion: 90 },
  { day: "Fri", completion: 80 },
  { day: "Sat", completion: 95 },
  { day: "Sun", completion: 60 },
]

const monthData = [
  { week: "W1", score: 72 },
  { week: "W2", score: 78 },
  { week: "W3", score: 85 },
  { week: "W4", score: 82 },
]

interface DashboardTabsProps {
  selectedHabitId: string
}

export function DashboardTabs(
  { selectedHabitId }: DashboardTabsProps
) {
  const [activeTab, setActiveTab] = useState<"today" | "week" | "month">("today")

  const { state } = useTrackCtx()

  const { habits } = state

  const currentHabit = useToUpdateHabitStepsCompletion().updatedHabit || habits[0]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{currentHabit.title}</CardTitle>
            <CardDescription>Track your daily progress</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{currentHabit.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <Button
            variant={activeTab === "today" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("today")}
            className="border-b-2"
          >
            Today
          </Button>
          <Button variant={activeTab === "week" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("week")}>
            Week
          </Button>
          <Button variant={activeTab === "month" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("month")}>
            Month
          </Button>
        </div>

        {/* Today Tab */}
        {activeTab === "today" && (
          <div className="space-y-3">
            {
            // dailyData
            currentHabit.steps
            .map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">⏰ {item.time}</p>
                </div>
                <span className={`text-sm font-semibold ${item.completed ? "text-accent" : "text-muted-foreground"}`}>
                  {item.completed ? "✓" : "[]"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Week Tab */}
        {activeTab === "week" && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completion" fill="hsl(var(--color-primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Month Tab */}
        {activeTab === "month" && (
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--color-primary))"
                    dot={{ fill: "hsl(var(--color-primary))", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <p className="text-2xl font-bold text-accent">82</p>
              <p className="text-sm text-muted-foreground">Monthly Score</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
