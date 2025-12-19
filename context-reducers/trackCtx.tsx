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
    habits: TrackTypes[]
}


const trackReducer = (state: initialStateTypes, action: { type: string, payload: any }) => {
    switch (action.type) {
        case 'CREATE_HABIT':
            return {
                ...state,
                habits: [...state.habits, action.payload]
            }
        default:
            return state
    }
}
const initialState: initialStateTypes = {
    habits: [
        {
            id: '',
            title: '',
            description: '',
            frequency: 'daily',
            duration: 0,
            measurement: {
                metric: '',
                target: 0,
            },
            steps: [],
            successDefinition: {
                enabled: false,
                percentage: 0,
            },
            createdAt: new Date(),
            currentStreak: 0,
            totalCompleted: 0
        }
    ]
}

const TrackContext = createContext<{
    state: initialStateTypes
    dispatch: React.Dispatch<{ type: string, payload: any }>
}>({
    state: initialState,
    dispatch: () => { }
})

const TrackContextProvider = ({ Children }: { Children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(trackReducer, initialState)
    return (
        <TrackContext.Provider value={{ state, dispatch }}>
            {Children}
        </TrackContext.Provider>
    )
}

export default TrackContextProvider

export const useTrackCtx = () => useContext(TrackContext)