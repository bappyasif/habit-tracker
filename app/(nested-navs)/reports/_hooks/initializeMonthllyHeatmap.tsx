import { useEffect } from "react"
import { mockCalendarHeatmapDataWithValues } from "../_utils/calendar-mock-data"
import { useTrackCtx } from "@/context-reducers/trackCtx"

export const useToInitializeMonthlyHeatmap = () => {
    const {heatmapData} = mockCalendarHeatmapDataWithValues()

    const {state, dispatch} = useTrackCtx()

    useEffect(() => {
        // This is just a placeholder to show how you can initialize the heatmap data when the component mounts.
        // In a real application, you would fetch this data from your backend or calculate it based on user habits.
        console.log("Initializing monthly heatmap with data:", heatmapData)

        dispatch({
            type: "add-monthly-heatmap-insights",
            payload: {
                habitId: state.habitViewing,
                data: [{
                    month: new Date().getMonth(),
                    data: heatmapData
                }]
            }
        })

    }, [])
}