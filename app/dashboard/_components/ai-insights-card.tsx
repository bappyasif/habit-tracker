"use client"

import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { ChevronDown, Lightbulb, RotateCw } from "lucide-react"

interface AIInsightsCardProps {
  weeklyText: string
  suggestions: string[]
  onAdjustPlan: () => void
}

export function AIInsightsCard({ weeklyText, suggestions, onAdjustPlan }: AIInsightsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsLoading(false)
  }

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

        {/* Suggestions */}
        <div>
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
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={onAdjustPlan} className="flex-1 bg-transparent">
            Adjust Plan
          </Button>
          <Button size="sm" onClick={handleRefresh} disabled={isLoading} className="flex-1">
            {isLoading ? "Regenerating..." : "Regenerate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
