"use client"

interface ProgressRingProps {
  radius?: number
  strokeWidth?: number
  percentage: number
  label?: string
}

export function ProgressRing({ radius = 60, strokeWidth = 6, percentage, label }: ProgressRingProps) {
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center">
      <svg height={radius * 2 + strokeWidth * 2} width={radius * 2 + strokeWidth * 2} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          stroke="hsl(var(--color-muted))"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
        />
        {/* Progress circle */}
        <circle
          stroke="hsl(var(--color-primary))"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-lg md:text-xl xl:text-2xl font-bold">{percentage}%</p>
        {label && <p className="text-xs text-muted-foreground">{label}</p>}
      </div>
    </div>
  )
}
