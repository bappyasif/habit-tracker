import { ca } from "date-fns/locale";
import { Children, createContext, useContext, useReducer } from "react";

type Frequency = "daily" | "weekly" | "monthly"

type  insights = {
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

type initialStateTypes = {
    habits: TrackTypes[],
    habitViewing: number,
    habitInsights: {
        insights: insights | null,
        habitId: number | string | null
    }[]
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
                    habitId: action.payload.habitId
                }]
            }

        case "ADD_A_HABIT_STEP":
            console.log(action.payload, "action.payload: ADD NEW")
            return {
                ...state,
                habits: state.habits.map((habit) => {
                    if (habit.id === action.payload.habitId) {
                        return {
                            ...habit,
                            steps: [...habit.steps, action.payload.newStep]
                        }
                    }
                    return habit
                })

            }

        default:
            return state
    }
}
const initialState: initialStateTypes = {
    habits: [],
    habitViewing: -1,
    habitInsights: []
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