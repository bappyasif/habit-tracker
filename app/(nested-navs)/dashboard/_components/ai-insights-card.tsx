"use client"

import { useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { ChevronDown, Lightbulb, RotateCw } from "lucide-react"
import { useTrackCtx } from "@/context-reducers/trackCtx"
import Link from "next/link"
import { useToFetchInsights } from "@/hooks/use-to-fetch-insights"

interface AIInsightsCardProps {
  weeklyText: string
  suggestions: string[]
}

export function AIInsightsCard({ weeklyText, suggestions }: AIInsightsCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { state } = useTrackCtx()

  const { dailyLogs } = state

  const habitData = state.habits.find(habit => Number(habit.id) === state.habitViewing)

  const { fetchAiInsightsData } = useToFetchInsights()

  // this is a single day data of a habit extracted and mapped based on found data frpom daily logs data from that day.
  const handleRefresh = async () => {
    setIsLoading(true)

    let props = { title: habitData?.title || "", steps: habitData?.steps || [], totalCompleted: habitData?.totalCompleted || 0 }

    const checkLogsFound = dailyLogs.find(log => log.habitId == state.habitViewing)

    const dateLog = checkLogsFound?.logs.find(log => new Date(log.date).toDateString() == new Date().toDateString())

    const mapSteps = dateLog?.log_ids_with_notes.map(log => log.id)

    const updatedMappedSteps = habitData?.steps.map(step => {
      if (mapSteps?.includes(step.id)) {
        return { ...step, completed: true }
      }
      return step
    })

    if (updatedMappedSteps?.length !== 0) {
      const completedSteps = updatedMappedSteps?.filter(step => step.completed).length

      const totalCompleted = Math.round((completedSteps! / updatedMappedSteps!?.length) * 100)

      const updatedHabitData = { ...habitData, steps: updatedMappedSteps, totalCompleted }
      props = { title: updatedHabitData?.title || "", steps: updatedHabitData?.steps || [], totalCompleted: updatedHabitData?.totalCompleted || 0 }
    }

    console.log(props, "PROPS", habitData)

    fetchAiInsightsData(props)
      .then(async () => {
        setIsLoading(false)
      })
  }

  const insights = state.habitInsights?.find(insight => insight.habitId === state.habitViewing)?.insights

  const adjustReady = state.habitInsights?.find(insight => insight.habitId === state.habitViewing)?.daily?.length || 0 > 0

  const handleOnAdjustPlan = () => {
    // onAdjustPlan()
    console.log("handleOnAdjustPlan", insights)
  }

  return (
    <Card className="bg-linear-to-br from-primary/10 to-accent/10 border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Daily summary & suggestions</CardDescription>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={handleRefresh} disabled={isLoading}>
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Weekly Summary */}
        <div className="p-3 bg-card/50 rounded-lg border border-primary/20">
          <p className="text-sm text-foreground">{weeklyText}</p>
        </div>

        {/* Expandables Data */}
        <ShowInformationOnExapand data={insights?.suggestions || suggestions} label="Actionable Suggestions" />
        <ShowInformationOnExapand data={insights?.areasOfImprovement || []} label="Areas of Improvement" />
        <ShowInformationOnExapand data={insights?.strengths || []} label="Strengths" />

        {/* CTA Buttons */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={handleOnAdjustPlan} className={`flex-1 bg-transparent transition ease-in-out delay-100 ${!adjustReady ? "cursor-not-allowed opacity-50" : "animate-pulse bg-primary/40"}`} disabled={!adjustReady}>
            <Link
              href="/create-habit"
            >
              Adjust plan
            </Link>
          </Button>
          <Button size="sm" onClick={handleRefresh} disabled={isLoading} className="flex-1">
            {isLoading ? "Regenerating..." : "Regenerate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


const ShowInformationOnExapand = ({ data, label }: { data: string[], label: string }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-2 text-sm font-semibold hover:text-primary transition"
      >
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>
      {isExpanded && (
        <ul className="space-y-2 text-sm">
          {data.map((txt, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="text-accent font-bold">•</span>
              <span className="text-muted-foreground">{txt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}