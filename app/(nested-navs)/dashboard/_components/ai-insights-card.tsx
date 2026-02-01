"use client"

import { act, useEffect, useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { ChevronDown, Lightbulb, RotateCw } from "lucide-react"
import { fetchAiInsights } from "../_utils/fetch-insights"
import { useTrackCtx } from "@/context-reducers/trackCtx"
import Link from "next/link"
import { useToFetchInsights } from "@/hooks/use-to-fetch-insights"

interface AIInsightsCardProps {
  weeklyText: string
  suggestions: string[]
  onAdjustPlan: () => void
}

export function AIInsightsCard({ weeklyText, suggestions, onAdjustPlan }: AIInsightsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // const [insights, setInsights] = useState<{
  //   suggestions: string[];
  //   areasOfImprovement: string[];
  //   strengths: string[];
  // } | null>({
  //   suggestions: suggestions,
  //   areasOfImprovement: [],
  //   strengths: [],
  //   // weeklySummary: "",
  // })

  const { state, dispatch } = useTrackCtx()

  const habitData = state.habits.find(habit => Number(habit.id) === state.habitViewing)

  console.log(state, "state in ai insights card", habitData)

  const { fetchAiInsightsData } = useToFetchInsights()

  const handleRefresh = async () => {
    setIsLoading(true)
    // console.log(habitData?.title || "", habitData?.description || "", `completed about ${habitData?.totalCompleted.toString()} percent of the steps` || "",  habitData?.steps.map(step => `completed:${step.completed}, step:${step.title}, time:${step.time}`).join(", ") || "", "fetching new insights...")
    // const data = await fetchAiInsights(habitData?.title || "", habitData?.description || "", `completed about ${habitData?.totalCompleted.toString()} percent of the steps` || "")

    // const props = { title: habitData?.title || "", steps: habitData?.steps || [], totalCompleted: habitData?.totalCompleted || 0, whattoFetch: "daily-insights"}

    const props = { title: habitData?.title || "", steps: habitData?.steps || [], totalCompleted: habitData?.totalCompleted || 0}

    // fetchAiInsightsData(habitData?.title || "", habitData?.steps || [], habitData?.totalCompleted || 0)
    fetchAiInsightsData(props)
    .then(async () => {
      // await new Promise((resolve) => setTimeout(resolve, 600))
      setIsLoading(false)
    })


    // const data = await fetchAiInsights(habitData?.title || "", habitData?.steps.map(step => `completed:${step.completed}, step:${step.title}, time:${step.time}`).join(", ") || "", `completed about ${habitData?.totalCompleted.toString()} percent of the steps` || "")
    // console.log(data, "data")
    // if (data?.response) {
    //   dispatch({
    //     type: "SET_INSIGHTS",
    //     payload: {
    //       insights: {
    //         suggestions: data.response?.actionable_steps || [],
    //         areasOfImprovement: data.response?.areas_for_improvement || [],
    //         strengths: data.response?.strengths || [],
    //         actions: data.response?.actions || [],
    //       },
    //       habitId: state.habitViewing
    //     }
    //   })

    //   console.log(state, "state after dispatching insights data")
    // setInsights({
    //   suggestions: data.response?.actionable_steps,
    //   areasOfImprovement: data.response?.areas_for_improvement,
    //   strengths: data.response?.strengths,
    //   // weeklySummary: data.weeklySummary,
    // })
    // }
    // await new Promise((resolve) => setTimeout(resolve, 600))
    // setIsLoading(false)
  }

  const handleOnAdjustPlan = () => {
    onAdjustPlan()
  }

  // useEffect(() => {
  //   // handleRefresh()
  //   isLoading && setIsExpanded(true)
  // }, [])

  const insights = state.habitInsights?.find(insight => insight.habitId === state.habitViewing)?.insights


  return (
    <Card className="bg-linear-to-br from-primary/10 to-accent/10 border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Weekly summary & suggestions</CardDescription>
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
        {/* <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full mb-2 text-sm font-semibold hover:text-primary transition"
          >
            <span>Actionable Suggestions</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
          {isExpanded && (
            <ul className="space-y-2 text-sm">
              {suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-accent font-bold">•</span>
                  <span className="text-muted-foreground">{suggestion}</span>
                </li>
              ))}
            </ul>
          )}
        </div> */}

        {/* CTA Buttons */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={handleOnAdjustPlan} className="flex-1 bg-transparent">
            <Link
              href="/create-habit"
            // onClick={() => {
            //   dispatch({ type: "UPDATE_HABIT_VIEWING", payload: state.habitViewing })
            // }}
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