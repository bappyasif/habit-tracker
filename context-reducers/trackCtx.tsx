import { ca } from "date-fns/locale";
import { Children, createContext, useContext, useReducer } from "react";

export type TrackTypes = {
    id: string;
    title: string;
    description: string;
    frequency: "daily";
    duration: number;
    measurement: {
        metric: string;
        target: number;
    };
    steps: {
        id: string;
        title: string;
        time: string;
        completed: boolean;
    }[];
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
    habitViewing: number
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

        default:
            return state
    }
}
const initialState: initialStateTypes = {
    habits: [],
    habitViewing: -1
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