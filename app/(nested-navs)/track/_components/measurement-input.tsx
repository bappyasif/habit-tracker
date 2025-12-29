"use client"

import type React from "react"
import { Card, CardContent } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Button } from "../../../../components/ui/button"
import { Plus, Minus } from "lucide-react"

interface MeasurementInputProps {
  metric: string
  target: number
  currentValue: number
  onValueChange: (value: number) => void
}

export function MeasurementInput({ metric, target, currentValue, onValueChange }: MeasurementInputProps) {
  const progress = Math.min((currentValue / target) * 100, 100)

  const handleIncrement = () => {
    onValueChange(currentValue + 1)
  }

  const handleDecrement = () => {
    if (currentValue > 0) {
      onValueChange(currentValue - 1)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    onValueChange(value)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Daily Measurement</Label>
            <p className="text-sm text-muted-foreground">
              Target: {target} {metric}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground text-right">{progress.toFixed(0)}% of target</p>
          </div>

          {/* Input Controls */}
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={handleDecrement}>
              <Minus className="w-4 h-4" />
            </Button>

            <div className="flex-1">
              <Input
                type="number"
                value={currentValue}
                onChange={handleChange}
                className="text-center text-2xl font-bold h-12"
              />
              <p className="text-xs text-muted-foreground text-center mt-1">{metric}</p>
            </div>

            <Button size="sm" variant="outline" onClick={handleIncrement}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
