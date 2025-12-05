"use client"
import { Card, CardContent } from "./ui/card"

interface HabitCardProps {
  title: string
  icon?: string
  description: string
  onClick?: () => void
}

export function HabitCard({ title, icon, description, onClick }: HabitCardProps) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-200 group"
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {icon && <div className="text-3xl group-hover:scale-110 transition-transform">{icon}</div>}
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
