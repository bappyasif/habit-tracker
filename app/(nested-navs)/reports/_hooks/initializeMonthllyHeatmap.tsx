import { useEffect } from "react"
import { mockCalendarHeatmapDataWithValues } from "../_utils/calendar-mock-data"
import { useTrackCtx } from "@/context-reducers/trackCtx"

export const useToInitializeMonthlyHeatmap = () => {
    const { heatmapData } = mockCalendarHeatmapDataWithValues()

    const { state, dispatch } = useTrackCtx()

    useEffect(() => {
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