import { fetchAiInsights } from "@/app/(nested-navs)/dashboard/_utils/fetch-insights"
import { useTrackCtx } from "@/context-reducers/trackCtx"

type dailyProps = {
    title: string,
    steps: { id: string, title: string, time: string, completed: boolean }[], totalCompleted: number,
}

type weeklyProps = {
    name: string,
    description: string,
    feedback: number
}

export const useToFetchInsights = () => {
    const { state, dispatch } = useTrackCtx()

    const updateInsights = (suggestions: string[], areasOfImprovement: string[], strengths: string[], actions: string[], dailySummary: string) => {
        dispatch({
            type: "SET_INSIGHTS",
            payload: {
                insights: {
                    suggestions: suggestions,
                    areasOfImprovement: areasOfImprovement,
                    strengths: strengths,
                    actions: actions,
                    dailySummary: dailySummary
                },
                habitId: state.habitViewing
            }
        })
    }

    const updateSteps = (actions: string[]) => {
        // updating actionable steps in reducers state
        dispatch({
            type: "ADD_HABIT_STEPS_FROM_AI_INSIGHTS",
            payload: {
                habitId: state.habitViewing,
                data: {
                    steps: actions
                }
            }
        })
    }

    const fetchAiInsightsData = async (props: dailyProps) => {
        const { title, steps, totalCompleted } = props

        const payloadData = {
            name: title || "",
            description:steps.map(step => `completed:${step.completed}, step:${step.title}, time:${step.time}`).join(" \n ") || "",
            feedback:`completed about ${totalCompleted.toString()} percent of the steps for today` || ""
        }

        // daily insights
        const data = await fetchAiInsights(payloadData.name, payloadData.description, payloadData.feedback)

        console.log(data, "data")

        if (data?.response) {
            updateInsights(data.response?.actionable_steps || [], data.response?.areas_for_improvement || [], data.response?.strengths || [], data.response?.actions || [], data.response?.daily_summary || "")
            updateSteps(data.response?.actions || [])
        }
    }

    const fetchWeeklySummary = async (props: dailyProps) => {
        const { title, steps, totalCompleted } = props

        const data = await fetchAiInsights(
            title || "",
            steps.map(step => `completed:${step.completed}, step:${step.title}, time:${step.time}`).join(", ") || "",
            `completed about ${totalCompleted.toString()} percent of the steps` || "", 
            "ai-weekly-summary-insights"
        )

        console.log(data, "weekly ai summary data")

        if (data?.response) {
            return data.response?.summary
        }
    }

    const fetchMonthlySummary = async (props: dailyProps) => {
        const { title, steps, totalCompleted } = props

        const response = await fetchAiInsights(
            title || "",
            steps.map(step => `completed:${step.completed}, step:${step.title}, time:${step.time}`).join(", ") || "",
            `completed about ${totalCompleted.toString()} percent of the steps` || "", 
            "ai-monthly-trends"
        )

        console.log(response, "monthly trends from AI")

        if (response?.trends) {
            return response.trends
        }
    }

    return { fetchAiInsightsData, fetchWeeklySummary, fetchMonthlySummary }
}