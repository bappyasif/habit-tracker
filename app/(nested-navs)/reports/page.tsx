"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InsightCards } from "@/app/(nested-navs)/reports/_components/insight-cards"
import { SuggestionsList } from "@/app/(nested-navs)/reports/_components/suggestions-list"
import { HeatmapCalendar } from "@/app/(nested-navs)/reports/_components/heatmap-calendar"
import { mockInsights } from "@/lib/mock-data"
import { CalendarDays } from "lucide-react"
import { useToFetchInsights } from "@/hooks/use-to-fetch-insights"
import { useTrackCtx } from "@/context-reducers/trackCtx"
import { useToBooleanLock } from "@/hooks/useToBooleanLock"
import { useToHandleMappingHabitSteps } from "./_hooks/handleMappingHabitSteps"
import { randomUUID } from "crypto"
import { updateHabit } from "@/server-calls/habits"

interface Suggestion {
  id: string
  text: string
  accepted: boolean
}

export default function ReportsPage() {
  const { state, dispatch } = useTrackCtx()

  const sugg = state?.habitInsights?.find(insight => Number(insight.habitId) === state.habitViewing)?.insights?.suggestions

  const [suggestions, setSuggestions] = useState<Suggestion[]>((sugg || mockInsights.suggestions)?.map((text: string, idx: number) => ({
    id: Math.random().toString(),
    text,
    accepted: false,
  })) || [])

  const handleAcceptSuggestion = (id: string) => {
    setSuggestions(suggestions.map((s) => (s.id === id ? { ...s, accepted: true } : s)))
  }

  const handleRejectSuggestion = (id: string) => {
    setSuggestions(suggestions.filter((s) => s.id !== id))
  }

  const handleUpdateHabit = (newStep: typeof state.habits[0]["steps"][0]) => {
    const habit = state.habits.find(habit => Number(habit.id) === state.habitViewing)

    if(!habit) return

    habit?.steps.push(newStep)

    updateHabit(habit)

  }

  const handleCreateNewHabit = (suggestion: string) => {
    const newStep = {
          // id: Math.random().toString(),
          // id: randomUUID(),
          id: crypto.randomUUID(),
          title: suggestion,
          completed: false,
          time: new Date().toISOString()
        }

    handleUpdateHabit(newStep)

    dispatch({
      type: "ADD_A_HABIT_STEP",
      payload: {
        habitId: state.habitViewing,
        newStep
        // newStep: {
        //   // id: Math.random().toString(),
        //   id: randomUUID(),
        //   title: suggestion,
        //   completed: false,
        //   time: new Date().toISOString()
        // }
      }
    })

    dispatch({
      type: "remove-from-habit-suggestions",
      payload: {
        habitId: state.habitViewing,
        suggestion
      }
    })
  }

  const habit = state.habits.find(habit => Number(habit.id) === state.habitViewing)

  const { fetchWeeklySummary, fetchMonthlySummary } = useToFetchInsights()

  const { lock, toggleLock } = useToBooleanLock()

  const [weeklySummary, setWeeklySummary] = useState<string>("")

  const { mapWeeklyDataWithHabitData } = useToHandleMappingHabitSteps()

  const handleRegenerateSummary = async () => {
    toggleLock()

    const allStepsFromThisWeek = mapWeeklyDataWithHabitData() || []

    const allCompletedStepsFromThisWeek = allStepsFromThisWeek.filter(step => step.completed)

    const completionRate = allStepsFromThisWeek.length ? (allCompletedStepsFromThisWeek.length / allStepsFromThisWeek.length) * 100 : 0
    
    fetchWeeklySummary({
      title: habit?.title || "",
      steps: habit?.steps || [],
      totalCompleted: completionRate
    }).then(data => {
      console.log(data, "weekly summary data from AI")
      
      setWeeklySummary(data)

      dispatch({
        type: "add-weekly-summary-insights",
        payload: {
          habitId: habit?.id,
          data
        }
      })

    }).catch(err => console.log(err))
      .finally(() => {
        // releases lock
        toggleLock()
      })
  }

  const [monthlyTrends, setMonthlyTrends] = useState<string>("")

  const {mapMonthLongDataWithHabitData} = useToHandleMappingHabitSteps()

  const handleRegenerateMonthlyTrend = async () => {
    const allStepsFromThisMonth = mapMonthLongDataWithHabitData() || habit?.steps || []

    const allCompletedStepsFromThisMonth = allStepsFromThisMonth.filter(step => step.completed)

    const completionRate = allStepsFromThisMonth.length ? (allCompletedStepsFromThisMonth.length / allStepsFromThisMonth.length) * 100 : 0

    fetchMonthlySummary({
      title: habit?.title || "",
      steps: allStepsFromThisMonth.map(step => ({
        id: step.id,
        title: step.title,
        time: step.time,
        completed: step.completed
      })),
      totalCompleted: completionRate
    }).then(data => {
      console.log(data, "monthly trends from AI")
      data && setMonthlyTrends(data)
    }).catch(err => console.log(err))
  }

  const handleRequestAdjustment = async () => {
    // Simulate AI adjustment request
    alert("Adjustment request sent to AI!")
  }

  useEffect(() => {
    if (state.dailyLogs.length && !lock) {
      handleRegenerateSummary()
      handleRegenerateMonthlyTrend()
    }
  }, [state.dailyLogs])

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Reports & Insights</h1>
        <p className="text-muted-foreground">Weekly summaries, trends, and AI-powered recommendations</p>
      </div>

      {/* Insight Cards */}
      <div className="mb-8">
        <InsightCards
          btnLocked={lock}
          weeklySummary={weeklySummary || "Loading data...."}
          monthlyTrend={monthlyTrends || "Loading data...."}
          goalStatus={82}
          onRegenerateSummary={handleRegenerateSummary}
          onRequestAdjustment={handleRequestAdjustment}
        />
      </div>

      {/* Suggestions */}
      <SuggestionsList
        suggestions={suggestions}
        onAcceptSuggestion={handleAcceptSuggestion}
        onRejectSuggestion={handleRejectSuggestion}
        onCreateNewHabit={handleCreateNewHabit}
      />

      {/* Monthly Heatmap */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Monthly Activity Heatmap
          </CardTitle>
          <CardDescription>Color intensity shows your daily completion percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <HeatmapCalendar />
        </CardContent>
      </Card>
    </main>
  )
}
