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

  const handleCreateNewHabit = (suggestion: string) => {
    dispatch({
      type: "ADD_A_HABIT_STEP",
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
  }

  const habit = state.habits.find(habit => Number(habit.id) === state.habitViewing)

  const extractWeekworthOfDailyLogs = () => {
    const dailyLogs = state.dailyLogs.filter(log => log.habitId == state.habitViewing)
    // console.log(dailyLogs, "all daily logs for the habit", state.dailyLogs)
    const last7DaysLogs = dailyLogs.slice(-7)

    return last7DaysLogs
  }

  const mapWeeklyDtaWithHabitData = () => {
    const weekworthOfDailyLogs = extractWeekworthOfDailyLogs()
    const weeklyLogs = weekworthOfDailyLogs.find(log => log.habitId == state.habitViewing)

    // lets recreate Habit data by updating steps data that are found in weekly logs with the completed status from logs
    const mappedHabitSteps = habit?.steps.map(step => {
      const logForStep = weeklyLogs?.logs.find(log => log.log_ids_with_notes.some(logWithNote => logWithNote.id == step.id))
      if (logForStep) {
        return {
          ...step,
          completed: logForStep.log_ids_with_notes.length ? true : false
        }
      }
      return step
    })

    // console.log(mappedHabitSteps, "mapped habits with weekly logs")


    // console.log(weeklyLogs, "weekly logs for the habit")

    return mappedHabitSteps
  }

  // mapWeeklyDtaWithHabitData()

  // console.log(extractWeekworthOfDailyLogs(), "week worth of daily logs")

  const { fetchWeeklySummary } = useToFetchInsights()

  const { lock, toggleLock } = useToBooleanLock()

  // const completionrate = state.completionRate.find(rate => Number(rate.habitId) === state.habitViewing)?.weeks

  // console.log(completionrate, "completion rate", state.completionRate)

  const handleRegenerateSummary = async () => {
    toggleLock()
    const allStepsFromThisWeek = mapWeeklyDtaWithHabitData() || habit?.steps || []

    const completionRate = allStepsFromThisWeek.length ? (allStepsFromThisWeek.filter(step => step.completed).length / allStepsFromThisWeek.length) * 100 : 0
    
    // console.log(allStepsFromThisWeek, "all steps from this week")

    // console.log(completionRate, "completion rate")

    fetchWeeklySummary({
      title: habit?.title || "",
      steps: habit?.steps || [],
      // totalCompleted: completionrate ? completionrate[completionrate.length - 1]?.percentile || 0 : 0,
      totalCompleted: completionRate
    }).then(data => {
      console.log(data, "weekly summary data from AI")
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

  const handleRequestAdjustment = async () => {
    // Simulate AI adjustment request
    alert("Adjustment request sent to AI!")
  }

  useEffect(() => {
    if (state.dailyLogs.length && !lock) {
      handleRegenerateSummary()
    }
  }, [state.dailyLogs])

  // useEffect(() => {
  //   fetchWeeklySummary({
  //     title: habit?.title || "",
  //     steps: habit?.steps || [],
  //     totalCompleted: completionrate ? completionrate[completionrate.length - 1]?.percentile || 0 : 0,
  //   }).then(data => {
  //     dispatch({
  //       type: "add-weekly-summary-insights",
  //       payload: {
  //         habitId: habit?.id,
  //         data
  //       }
  //     })
  //   }).catch(err => console.log(err))
  // }, [])

  const habitWeeklyData = state.habitInsights.find(insight => Number(insight.habitId) === state.habitViewing)

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
          <HeatmapCalendar />
        </CardContent>
      </Card>
    </main>
  )
}
