"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InsightCards } from "@/app/(nested-navs)/reports/_components/insight-cards"
import { SuggestionsList } from "@/app/(nested-navs)/reports/_components/suggestions-list"
import { HeatmapCalendar } from "@/app/(nested-navs)/reports/_components/heatmap-calendar"
import { mockInsights } from "@/lib/mock-data"
import { CalendarDays } from "lucide-react"
import { useToFetchInsights } from "@/hooks/use-to-fetch-insights"
import { useTrackCtx } from "@/context-reducers/trackCtx"

interface Suggestion {
  id: string
  text: string
  accepted: boolean
}

export default function ReportsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(
    mockInsights.suggestions.map((text, idx) => ({
      id: Math.random().toString(),
      text,
      accepted: false,
    })),
  )

  const currentMonth = new Date()
  const heatmapData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1),
    value: Math.floor(Math.random() * 100),
  }))

  const handleAcceptSuggestion = (id: string) => {
    setSuggestions(suggestions.map((s) => (s.id === id ? { ...s, accepted: true } : s)))
  }

  const handleRejectSuggestion = (id: string) => {
    setSuggestions(suggestions.filter((s) => s.id !== id))
  }

  const handleCreateNewHabit = (suggestion: string) => {
    console.log("Creating new habit from suggestion:", suggestion)
    alert(`New habit created: "${suggestion}"`)
  }

  const {state, dispatch} = useTrackCtx()

  const habit = state.habits.find(habit => Number(habit.id) === state.habitViewing)

  const {fetchWeeklySummary} = useToFetchInsights()

  const handleRegenerateSummary = async () => {
    // Simulate AI regeneration
    alert("Summary regenerated!")
    console.log(habit, "state in reports page")
    fetchWeeklySummary({
      title: habit?.title || "",
      steps: habit?.steps || [],
      totalCompleted: habit?.totalCompleted || 0,
      // whattoFetch: "weekly-summary"
    }).then(data => {
      console.log(data, "data-weekly-summary-insights")
      dispatch({
        type: "add-weekly-summary-insights",
        payload: {
          habitId: habit?.id,
          data
          // data: {
          //   // steps: data.response?.actions
          //   data
          // }
        }
      })
    }).catch(err => console.log(err))
  }

  const handleRequestAdjustment = async () => {
    // Simulate AI adjustment request
    alert("Adjustment request sent to AI!")
  }

  // const habitWeeklyData = state.weeklyInsights.find(insight => Number(insight.habitId) === state.habitViewing)

  const habitWeeklyData = state.habitInsights.find(insight => Number(insight.habitId) === state.habitViewing)
  
  console.log(state, "state in reports page")

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
          // weeklySummary={mockInsights.weeklyText}
          // weeklySummary={habitWeeklyData?.summary || mockInsights.weeklyText}
          weeklySummary={habitWeeklyData?.weekly || mockInsights.weeklyText}
          monthlyTrend={mockInsights.monthlyText}
          goalStatus={82}
          onRegenerateSummary={handleRegenerateSummary}
          onRequestAdjustment={handleRequestAdjustment}
        />
      </div>

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
          <HeatmapCalendar month={currentMonth} data={heatmapData} />
        </CardContent>
      </Card>

      {/* Suggestions */}
      <SuggestionsList
        suggestions={suggestions}
        onAcceptSuggestion={handleAcceptSuggestion}
        onRejectSuggestion={handleRejectSuggestion}
        onCreateNewHabit={handleCreateNewHabit}
      />
    </main>
  )
}
