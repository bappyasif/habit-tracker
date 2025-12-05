// Mock data for the habit tracker app
export const mockHabits = [
  {
    id: "1",
    title: "Morning Workout",
    description: "Get fit with daily exercises",
    frequency: "daily" as const,
    duration: 30,
    measurement: {
      metric: "minutes",
      target: 30,
    },
    steps: [
      { id: "s1", title: "Warm up", time: "06:00", completed: true },
      { id: "s2", title: "Cardio", time: "06:15", completed: true },
      { id: "s3", title: "Strength", time: "06:35", completed: false },
      { id: "s4", title: "Cool down", time: "06:55", completed: false },
    ],
    successDefinition: {
      enabled: true,
      percentage: 80,
    },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    currentStreak: 12,
    totalCompleted: 28,
  },
  {
    id: "2",
    title: "Drink Water",
    description: "Stay hydrated throughout the day",
    frequency: "daily" as const,
    duration: 365,
    measurement: {
      metric: "glasses",
      target: 8,
    },
    steps: [
      { id: "s1", title: "Morning glass", time: "07:00", completed: true },
      { id: "s2", title: "Mid-morning", time: "10:00", completed: true },
      { id: "s3", title: "Lunch time", time: "12:30", completed: true },
      { id: "s4", title: "Afternoon", time: "15:00", completed: false },
    ],
    successDefinition: {
      enabled: true,
      percentage: 85,
    },
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    currentStreak: 24,
    totalCompleted: 58,
  },
  {
    id: "3",
    title: "Sleep 7 hours",
    description: "Get quality sleep every night",
    frequency: "daily" as const,
    duration: 365,
    measurement: {
      metric: "hours",
      target: 7,
    },
    steps: [
      { id: "s1", title: "No screens by 9 PM", time: "21:00", completed: true },
      { id: "s2", title: "Sleep by 10 PM", time: "22:00", completed: true },
    ],
    successDefinition: {
      enabled: true,
      percentage: 70,
    },
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    currentStreak: 8,
    totalCompleted: 35,
  },
]

export const mockLogs = [
  {
    id: "log1",
    habitId: "1",
    date: new Date(),
    measurement: 30,
    stepsCompleted: [true, true, false, false],
    notes: "Felt good today",
  },
  {
    id: "log2",
    habitId: "2",
    date: new Date(),
    measurement: 6,
    stepsCompleted: [true, true, true, false],
    notes: "Need to drink more water",
  },
]

export const mockInsights = {
  weeklyText:
    "Great week! You completed 85% of your workouts. Try to add 15 minutes of stretching to reduce muscle soreness.",
  monthlyText: "Excellent progress! Your sleep schedule has improved by 2 hours. Keep it up!",
  suggestions: [
    "Add meditation to your morning routine for better focus",
    "Track your energy levels before and after workouts",
    "Set a reminder for evening water intake",
  ],
}
