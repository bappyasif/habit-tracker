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
import { useToBooleanLock } from "@/hooks/useToBooleanLock"

interface Suggestion {
  id: string
  text: string
  accepted: boolean
}

export default function ReportsPage() {
  const {state, dispatch} = useTrackCtx()

  const sugg = state?.habitInsights?.find(insight => Number(insight.habitId) === state.habitViewing)?.insights?.suggestions
  
  console.log(sugg, "sugg")

  // const [suggestions, setSuggestions] = useState<Suggestion[]>(
  //   mockInsights.suggestions.map((text, idx) => ({
  //     id: Math.random().toString(),
  //     text,
  //     accepted: false,
  //   })),
  // )

  const [suggestions, setSuggestions] = useState<Suggestion[]>((sugg || mockInsights.suggestions)?.map((text: string, idx: number) => ({
    id: Math.random().toString(),
    text,
    accepted: false,
  })) || [])

  // do we go for a monthly, weekly tracking reducers?
  // consderation1: if we want to show historical insights, we need to store them in the state, which means we need a reducer for that
  // consideration2: if we want to keep it simple, we can just store the latest insights in the state, and update them whenever we fetch new insights. This way we don't need a reducer for historical insights, but we also won't be able to show historical insights in the UI.

  // data for heatmap - should maintain what it is heatmap-calendar component expects, which means an array of objects with date representing each day of month and value representing completion percentage for that day.

  // how do we update monthly data?
  // consideration1: we can add this functionality within our tracking functionality, so whenver we update our habit steps tracking data, we also update our monthly data for that day in reducers state. This way we can ensure that our heatmap is always up to date with the latest tracking data.
  // consideration2: we can have a separate functionality that runs at the end of each day (using something like node-cron or setTimeout) to calculate the completion percentage for that day and update the monthly data in reducers state. This way we can decouple the heatmap data updating from the tracking functionality, but it also adds some complexity in terms of ensuring the cron job runs reliably.

  // heatmap initial data: 
  // for now we will just use a random number between 0 and 100 for each day of the month to simulate the completion percentage. In a real application, we would calculate this based on the user's habit tracking data.
  
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
    dispatch({
      type:"ADD_A_HABIT_STEP",
      payload: {
        habitId: state.habitViewing,
        newStep: {
          id: Math.random().toString(),
          title: suggestion,
          completed: false,
          time: new Date().toISOString()
        }
      }
    })

    dispatch({
      type: "remove-from-habit-suggestions",
      payload: {
        habitId: state.habitViewing,
        suggestion
      }
    })
    // alert(`New habit created: "${suggestion}"`)
  }

  const habit = state.habits.find(habit => Number(habit.id) === state.habitViewing)

  const {fetchWeeklySummary} = useToFetchInsights()

  const {lock, toggleLock} = useToBooleanLock()

  const handleRegenerateSummary = async () => {
    // Simulate AI regeneration
    // alert("Summary regenerated!")
    // ensures lock
    toggleLock()
    console.log(habit, "state in reports page", lock, "LOCK")
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
    .finally(() => {
      // releases lock
      toggleLock()
      console.log(lock, "LOCK done?!")
    })
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
          btnLocked={lock}
          // weeklySummary={mockInsights.weeklyText}
          // weeklySummary={habitWeeklyData?.summary || mockInsights.weeklyText}
          weeklySummary={habitWeeklyData?.weekly || mockInsights.weeklyText}
          monthlyTrend={mockInsights.monthlyText}
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
          <HeatmapCalendar month={currentMonth} data={heatmapData} />
        </CardContent>
      </Card>
    </main>
  )
}
