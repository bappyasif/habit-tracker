import { fetchAiInsights } from "@/app/(nested-navs)/dashboard/_utils/fetch-insights"
import { useTrackCtx } from "@/context-reducers/trackCtx"

type dailyProps = {
    title: string,
    steps: { id: string, title: string, time: string, completed: boolean }[], totalCompleted: number,
    // whattoFetch: string
}

type weeklyProps = {
    name: string,
    description: string,
    feedback: number
}

export const useToFetchInsights = () => {
    const { state, dispatch } = useTrackCtx()

    const updateInsights = (suggestions: string[], areasOfImprovement: string[], strengths: string[], actions: string[]) => {
        dispatch({
            type: "SET_INSIGHTS",
            payload: {
                insights: {
                    suggestions: suggestions,
                    areasOfImprovement: areasOfImprovement,
                    strengths: strengths,
                    actions: actions,
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
                    // steps: data.response?.actions
                    steps: actions
                }
            }
        })
    }

    const fetchAiInsightsData = async (props: dailyProps) => {
        const { title, steps, totalCompleted } = props

        // const data = await fetchAiInsights(title || "", steps.map(step => `completed:${step.completed}, step:${step.title}, time:${step.time}`).join(", ") || "", `completed about ${totalCompleted.toString()} percent of the steps` || "")

        // daily insights
        const data = await fetchAiInsights(
            title || "",
            steps.map(step => `completed:${step.completed}, step:${step.title}, time:${step.time}`).join(", ") || "",
            `completed about ${totalCompleted.toString()} percent of the steps` || ""
        )

        console.log(data, "data")

        if (data?.response) {
            updateInsights(data.response?.actionable_steps || [], data.response?.areas_for_improvement || [], data.response?.strengths || [], data.response?.actions || [])
            updateSteps(data.response?.actions || [])

            console.log(state, "state after dispatching insights data")
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

        console.log(data, "data-weekly", props)

        if (data?.response) {

        }
    }

    // const fetchAiInsightsData = async (props: insightsProps) => {
    //     const { title, steps, totalCompleted } = props

    //     const data = await fetchAiInsights(title || "", steps.map(step => `completed:${step.completed}, step:${step.title}, time:${step.time}`).join(", ") || "", `completed about ${totalCompleted.toString()} percent of the steps` || "")

    //     console.log(data, "data")

    //     if (data?.response) {
    //         dispatch({
    //             type: "SET_INSIGHTS",
    //             payload: {
    //                 insights: {
    //                     suggestions: data.response?.actionable_steps || [],
    //                     areasOfImprovement: data.response?.areas_for_improvement || [],
    //                     strengths: data.response?.strengths || [],
    //                     actions: data.response?.actions || [],
    //                 },
    //                 habitId: state.habitViewing
    //             }
    //         })

    //         // updating actionable steps in reducers state
    //         dispatch({
    //             type: "ADD_HABIT_STEPS_FROM_AI_INSIGHTS",
    //             payload: {
    //                 habitId: state.habitViewing,
    //                 data: {
    //                     steps: data.response?.actions
    //                 }
    //             }
    //         })

    //         console.log(state, "state after dispatching insights data")
    //     }
    // }

    return { fetchAiInsightsData, fetchWeeklySummary }
}