"use client"

import { useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useTrackCtx } from "@/context-reducers/trackCtx"
import { useToUpdateHabitStepsCompletion } from "../_hooks/useToUpdateHabitStepsCompletion"

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
          <WeekTab />
        )}

        {/* Month Tab */}
        {activeTab === "month" && (
          <MonthTab />
        )}
      </CardContent>
    </Card>
  )
}

const MonthTab = () => {
  const { state } = useTrackCtx()

  const { habits, dailyLogs } = state

  const currentHabit = habits.find((habit) => Number(habit.id) === state.habitViewing)

  const habitLogs = dailyLogs.filter((log) => log.habitId == currentHabit?.id)

  const dailyLogsForMonth = habitLogs.map((log) => log.logs.filter((obj) => new Date(obj.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))

  const flattenedMonthlyLogsData = dailyLogsForMonth.flat()

  const today = new Date()

  const howManyDaysInthatMonth = (month: number, year: number) => {
    // month is 0 indexed so need to add 1
    return new Date(year, month + 1, 0).getDate()
  }

  const formattedData = []

  for (let i = 0; i < howManyDaysInthatMonth(today.getMonth(), today.getFullYear()); i++) {
    // decide if its on week 1 or week 2 or week3 or week4
    const week = Math.floor((i + 1) / 8)

    formattedData.push({
      week: week,
      score: flattenedMonthlyLogsData.find((log) => new Date(log.date).toDateString() === new Date(today.getFullYear(), today.getMonth(), i + 1).toDateString())?.percentile || 0,
    })
  }

  const monthlyFrequency = formattedData.reduce<Record<string, { week: string; score: number }>>((acc, item) => {
    const wn = item.week >= 0 && item.week <= 3 ? `W${item.week + 1}` : "W4";

    return acc[wn] ? { ...acc, [wn]: { ...acc[wn], score: acc[wn].score + item.score } } : { ...acc, [wn]: { week: wn, score: item.score } };
  }, {});

  const monthlyFreqValues = Object.values(monthlyFrequency).map((item) => ({
    week: item.week,
    score: Math.ceil(item.score / 7),
  }))

  console.log(monthlyFreqValues, "monthly freq values")

  return (
    <div className="space-y-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={monthlyFreqValues}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 100]} />
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
  )
}

const WeekTab = () => {
  const { state } = useTrackCtx()

  const { habits, dailyLogs } = state

  const currentHabit = habits.find(habit => Number(habit.id) == state.habitViewing)

  // make this comparisons against two timestamps instead of date strings
  const habitLogs = dailyLogs.filter(log => Number(log.habitId) == state.habitViewing)

  const dailyLogsForWeek = habitLogs.map(log => log.logs.filter(obj => new Date(obj.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)))

  const modifyWeekDataAsWeeklyDataFormat = dailyLogsForWeek.flat().map(log => {
    return {
      day: new Date(log.date).toLocaleString('en-US', { weekday: 'short' }),
      completion: log.log_ids_with_notes.length / currentHabit?.steps.length! * 100
    }
  })

  const withMissingDays = []

  for (let i = 0; i < 7; i++) {
    const findDay = modifyWeekDataAsWeeklyDataFormat.find(day => day.day == new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + i * 24 * 60 * 60 * 1000).toLocaleString('en-US', { weekday: 'short' }))
    if (findDay) {
      withMissingDays.push(findDay)
    } else {
      withMissingDays.push({ day: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + i * 24 * 60 * 60 * 1000).toLocaleString('en-US', { weekday: 'short' }), completion: 0 })
    }
  }

  console.log(withMissingDays, "withMissingDays")

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={withMissingDays}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tickLine={true} axisLine={true} />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="completion" fill="hsl(var(--color-primary))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}