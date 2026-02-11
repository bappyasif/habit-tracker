import { ca } from "date-fns/locale";
import { act, Children, createContext, useContext, useReducer } from "react";

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
    // month: Date
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
        monthly: MonthlyProps[] | null
    }[],
    // weeklyInsights: {
    //     habitId: number | string | null,
    //     summary: string
    // }[]
}


const trackReducer = (state: initialStateTypes, action: { type: string, payload: any }) => {
    switch (action.type) {
        case 'IINITIALIZE':
            return {
                ...state,
                habits: action.payload
            }
        case 'CREATE_HABIT':
            console.log(action.payload, "action.payload", state.habits)
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

        case "ADD_HABIT_STEPS_FROM_AI_INSIGHTS":
            console.log(action.payload, "action.payload: add habit steps from ai insights",)
            return {
                ...state,
                habits: state.habits.map((habit) => {
                    // console.log(habit, "habit >><<", action.payload.data.steps, habit.id, action.payload.habitId)
                    if (habit.id == action.payload.habitId) {
                        console.log(habit, "habit >><<", action.payload.data.steps)
                        return {
                            ...habit,
                            steps: action.payload.data.steps
                        }
                    }
                    return habit
                })
            }


        case "SET_INSIGHTS":
            console.log(action.payload, "action.payload", state.habitInsights)
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
                }]
            }

        case "ADD_A_HABIT_STEP":
            console.log(action.payload, "action.payload: ADD NEW")
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
            console.log(action.payload, "action.payload: REMOVE FROM HABIT SUGGESTIONS")
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
            console.log(action.payload, "action.payload: ADD NEW WEEKLY SUMMARY INSIGHTS")

            // return {
            //     ...state,
            //     weeklyInsights: state.weeklyInsights.length > 0 ? state.weeklyInsights.map((insight) => {
            //         if (insight.habitId === action.payload.habitId) {
            //             return {
            //                 ...insight,
            //                 summary: action.payload.data
            //             }
            //         }
            //         return insight
            //     }) : [{
            //         habitId: action.payload.habitId,
            //         summary: action.payload.data
            //     }]
            // }

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
                }]
            }

        case "add-monthly-heatmap-insights":
            console.log(action.payload, "action.payload: ADD NEW MONTHLY HEATMAP INSIGHTS")
            return {
                ...state,
                habitInsights: state.habitInsights.length > 0 ? state.habitInsights.map((insight) => {
                    if (insight.habitId == action.payload.habitId) {
                        console.log("UPDATED MONTHLY: INITIALIZED")
                        return {
                            ...insight,
                            // monthly: action.payload.data,
                            // monthly: [...insight.monthly || [], action.payload.data],
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
                    // would it cover when monthly data is being added first time when there is no weekly data?
                    // monthly: action.payload.data,
                    // monthly: [{
                    //     month: new Date().getMonth(),
                    //     data: action.payload.data
                    // }]
                    monthly: action.payload.data
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
    // weeklyInsights: [],
    // habitInsights: [{
    //     insights: null,
    //     habitId: null
    // }]
    // habits: [
    //     {
    //         id: '',
    //         title: '',
    //         description: '',
    //         frequency: 'daily',
    //         duration: 0,
    //         measurement: {
    //             metric: '',
    //             target: 0,
    //         },
    //         steps: [],
    //         successDefinition: {
    //             enabled: false,
    //             percentage: 0,
    //         },
    //         createdAt: new Date(),
    //         currentStreak: 0,
    //         totalCompleted: 0
    //     }
    // ]
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