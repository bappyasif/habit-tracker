"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { CheckCircle2, RotateCw } from "lucide-react"

interface InsightCardsProps {
  weeklySummary: string
  monthlyTrend: string
  goalStatus: number
  onRegenerateSummary: () => void
  onRequestAdjustment: () => void
}

export function InsightCards({
  weeklySummary,
  monthlyTrend,
  goalStatus,
  onRegenerateSummary,
  onRequestAdjustment,
}: InsightCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-xl">📊</span>
            Weekly Summary
          </CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground leading-relaxed">{weeklySummary}</p>
          <Button size="sm" variant="outline" className="w-full bg-transparent" onClick={onRegenerateSummary}>
            <RotateCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-xl">📈</span>
            Monthly Trend
          </CardTitle>
          <CardDescription>Progress over time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground leading-relaxed">{monthlyTrend}</p>
          <div className="text-xs text-muted-foreground">Updated daily with your latest logs</div>
        </CardContent>
      </Card>

      {/* Goal Status */}
      <Card className="bg-linear-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-xl">🎯</span>
            Goal Status
          </CardTitle>
          <CardDescription>This month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{goalStatus}%</span>
              <span className="text-sm text-muted-foreground">Complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div className="bg-accent h-full transition-all duration-500" style={{ width: `${goalStatus}%` }} />
            </div>
          </div>
          <Button size="sm" className="w-full" onClick={onRequestAdjustment}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Request Adjustment
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
