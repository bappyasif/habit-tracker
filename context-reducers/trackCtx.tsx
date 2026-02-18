import { createContext, useContext, useReducer } from "react";

type Frequency = "daily" | "weekly" | "monthly"

type insights = {
    suggestions: string[];
    areasOfImprovement: string[];
    strengths: string[];
    actions: string[];
}

export type Steps = {
    id: string;
    title: string;
    time: string;
    completed: boolean;
}

export type TrackTypes = {
    id: string;
    title: string;
    description: string;
    frequency: Frequency;
    duration: number;
    measurement: {
        metric: string;
        target: number;
    };
    steps: Steps[];
    successDefinition: {
        enabled: boolean;
        percentage: number;
    };
    createdAt: Date;
    currentStreak: number;
    totalCompleted: number;
}

type HeatmapDay = {
    date: Date
    value: number // 0-100
}

export type MonthlyProps = {
    month: Number // 1-12 representing the month for which the heatmap data is being stored. This will help in identifying which month's data is being represented in the heatmap.
    data: HeatmapDay[] // 0-100 values for each day in the month which will determine the intensity of the color in the heatmap. that 0 to 100 values represents the percentage of completion of the habit for that day. for example if the habit is to drink 2 liters of water daily and on a particular day the user drinks 1 liter of water then the value for that day will be 50.
}

export type initialStateTypes = {
    habits: TrackTypes[],
    habitViewing: number,
    habitInsights: {
        insights: insights | null,
        habitId: number | string | null,
        weekly: string | null,
        monthly: MonthlyProps[] | null,
        // instead of directly updating habit steps came from ai insights for habits we will keep it in insights and then await user action to add those steps to habit steps. So that user stays in control of any ddition from ai insights to its habit data.
        daily: Steps[] | null,
    }[],
}


const trackReducer = (state: initialStateTypes, action: { type: string, payload: any }) => {
    switch (action.type) {
        case 'IINITIALIZE':
            return {
                ...state,
                habits: action.payload
            }
        case 'CREATE_HABIT':
            return {
                ...state,
                habits: [...state.habits, action.payload]
            }

        case 'UPDATE_HABIT':
            return {
                ...state,
                habits: state.habits.map((habit) => {
                    if (habit.id === action.payload.id) {
                        return action.payload
                    }
                    return habit
                })
            }

        case 'UPDATE_HABIT_PAYLOAD':
            return {
                ...state,
                habits: state.habits.map((habit) => {
                    if (habit.id === action.payload.id) {
                        return {
                            ...habit,
                            ...action.payload.data
                        }
                    }
                    return habit
                })

            }

        case "UPDATE_HABIT_VIEWING":
            return {
                ...state,
                habitViewing: action.payload
            }

        case "DELETE_INSIGHTS_FOR_HABIT":
            return {
                ...state,
                habitInsights: state.habitInsights.filter((insight) => insight.habitId != action.payload.habitId)
            }

        // case "ADD_HABIT_STEPS_FROM_AI_INSIGHTS":
        //     return {
        //         ...state,
        //         habits: state.habits.map((habit) => {
        //             if (habit.id == action.payload.habitId) {
        //                 return {
        //                     ...habit,
        //                     steps: action.payload.data.steps
        //                 }
        //             }
        //             return habit
        //         })
        //     }
        case "ADD_HABIT_STEPS_FROM_AI_INSIGHTS":
            return {
                ...state,
                habitInsights: state.habitInsights.length > 0 ? state.habitInsights.map((insight) => {
                    if (insight.habitId == action.payload.habitId) {
                        return {
                            ...insight,
                            daily: action.payload.data.steps
                        }
                    }
                    return insight
                }) : [{
                    insights: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.insights || null,
                    habitId: action.payload.habitId,
                    weekly: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.weekly || null,
                    monthly: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.monthly || null,
                    daily: action.payload.data.steps
                }]
            }


        case "SET_INSIGHTS":
            return {
                ...state,
                habitInsights: state.habitInsights.length > 0 ? state.habitInsights.map((insight) => {
                    if (insight.habitId === action.payload.habitId) {
                        return {
                            ...insight,
                            insights: action.payload.insights
                        }
                    }
                    return insight
                }) : [{
                    insights: action.payload.insights,
                    habitId: action.payload.habitId,
                    weekly: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.weekly || null,
                    monthly: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.monthly || null,
                    daily: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.daily || null
                }]
            }

        case "ADD_A_HABIT_STEP":
            return {
                ...state,
                habits: state.habits.map((habit) => {
                    if (habit.id == action.payload.habitId) {
                        return {
                            ...habit,
                            steps: [...habit.steps, action.payload.newStep]
                        }
                    }
                    return habit
                })

            }

        case "remove-from-habit-suggestions":
            return {
                ...state,
                habitInsights: state.habitInsights.map((insight) => {
                    if (insight.habitId == action.payload.habitId) {
                        return {
                            ...insight,
                            insights: {
                                ...insight.insights,
                                suggestions: insight.insights?.suggestions.filter((suggestion) => suggestion !== action.payload.suggestion)
                            }
                        }
                    }
                    return insight
                })
            }

        case "add-weekly-summary-insights":
            return {
                ...state,
                habitInsights: state.habitInsights.length > 0 ? state.habitInsights.map((insight) => {
                    if (insight.habitId == action.payload.habitId) {
                        return {
                            ...insight,
                            weekly: action.payload.data
                        }
                    }
                    return insight
                }) : [{
                    insights: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.insights || null,
                    habitId: action.payload.habitId,
                    weekly: action.payload.data,
                    monthly: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.monthly || null,
                    daily: state.habitInsights.find(insight => insight.habitId === action.payload.habitId)?.daily || null
                }]
            }

        case "add-monthly-heatmap-insights":
            return {
                ...state,
                habitInsights: state.habitInsights.length > 0 ? state.habitInsights.map((insight) => {
                    if (insight.habitId == action.payload.habitId) {
                        return {
                            ...insight,
                            monthly: insight.monthly?.find(m => m.month == action.payload.data[0]?.month)
                                ? insight.monthly.map(m => m.month == action.payload.data[0]?.month ? action.payload.data[0] : m)
                                : [...insight.monthly || [], action.payload.data[0]],
                            habitId: action.payload.habitId
                        }
                    }
                    return insight
                }) : [{
                    insights: state.habitInsights.find(insight => insight.habitId == action.payload.habitId)?.insights || null,
                    habitId: action.payload.habitId,
                    weekly: state.habitInsights.find(insight => insight.habitId == action.payload.habitId)?.weekly || null,
                    monthly: action.payload.data,
                    daily: state.habitInsights.find(insight => insight.habitId == action.payload.habitId)?.daily || null
                }]
            }


        default:
            return state
    }
}
const initialState: initialStateTypes = {
    habits: [],
    habitViewing: -1,
    habitInsights: [],
}

const TrackContext = createContext<{
    state: initialStateTypes
    dispatch: React.Dispatch<{ type: string, payload: any }>
}>({
    state: initialState,
    dispatch: () => { }
})

const TrackContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(trackReducer, initialState)
    return (
        <TrackContext.Provider value={{ state, dispatch }}>
            {children}
        </TrackContext.Provider>
    )
}

export default TrackContextProvider

export const useTrackCtx = () => useContext(TrackContext)