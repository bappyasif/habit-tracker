// Modular AI client abstraction - easily replaceable
export interface AIResponse {
  text: string
  timestamp: Date
}

export interface AIClient {
  generatePlan(habitTitle: string, frequency: string): Promise<AIResponse>
  generateInsights(habitId: string, logs: any[]): Promise<AIResponse>
  regenerateInsights(habitId: string): Promise<AIResponse>
}

// Mock AI client for development
export class MockAIClient implements AIClient {
  async generatePlan(habitTitle: string, frequency: string): Promise<AIResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const plans: Record<string, string> = {
      "Morning Workout":
        "Start with a 5-minute warm-up, follow with 20 minutes of cardio, then 5 minutes of strength training. Cool down with stretches.",
      "Drink Water":
        "Drink one glass upon waking, one with each meal, and one before bed. Aim for 8-10 glasses throughout the day.",
      "Sleep 7 hours": "Go to bed at 10 PM, no screens after 9 PM. Create a dark, cool sleeping environment.",
      default: `Here's a structured plan for your ${habitTitle} habit: Start small, track consistently, and adjust based on your progress. Review weekly and celebrate wins.`,
    }

    return {
      text: plans[habitTitle] || plans["default"],
      timestamp: new Date(),
    }
  }

  async generateInsights(habitId: string, logs: any[]): Promise<AIResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const insights = [
      "Your consistency is improving! Try to maintain your current streak.",
      "Consider adding a reminder to stay on track with your habits.",
      "Great progress this week! Keep up the momentum.",
    ]

    return {
      text: insights[Math.floor(Math.random() * insights.length)],
      timestamp: new Date(),
    }
  }

  async regenerateInsights(habitId: string): Promise<AIResponse> {
    return this.generateInsights(habitId, [])
  }
}

// Factory function to get AI client
export function getAIClient(): AIClient {
  // In a real app, this would check for environment variables and create
  // the appropriate client (Vercel AI SDK, OpenAI, Anthropic, etc.)
  return new MockAIClient()
}
