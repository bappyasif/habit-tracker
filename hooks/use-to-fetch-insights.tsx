import { fetchAiInsights } from "@/app/(nested-navs)/dashboard/_utils/fetch-insights"
import { useTrackCtx } from "@/context-reducers/trackCtx"

export const useToFetchInsights = () => {
    const { state, dispatch } = useTrackCtx()

    const fetchAiInsightsData = async (title: string, steps: { id: string, title: string, time: string, completed: boolean }[], totalCompleted: number) => {
        const data = await fetchAiInsights(title || "", steps.map(step => `completed:${step.completed}, step:${step.title}, time:${step.time}`).join(", ") || "", `completed about ${totalCompleted.toString()} percent of the steps` || "")
        
        console.log(data, "data")
        
        if (data?.response) {
            dispatch({
                type: "SET_INSIGHTS",
                payload: {
                    insights: {
                        suggestions: data.response?.actionable_steps || [],
                        areasOfImprovement: data.response?.areas_for_improvement || [],
                        strengths: data.response?.strengths || [],
                        actions: data.response?.actions || [],
                    },
                    habitId: state.habitViewing
                }
            })

            // updating actionable steps in reducers state
            dispatch({
                type: "ADD_HABIT_STEPS_FROM_AI_INSIGHTS",
                payload: {
                    habitId: state.habitViewing,
                    data: {
                        steps: data.response?.actions
                    }
                }
            })

            console.log(state, "state after dispatching insights data")
        }
    }

    return { fetchAiInsightsData }
}