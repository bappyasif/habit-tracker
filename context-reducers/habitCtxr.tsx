import { createContext, useContext, useReducer } from "react"

interface Step {
  id: string
  title: string
  time: string
  completed: boolean
}

interface initialStateTypes {
  title: string
  frequency: "daily" | "weekly" | "monthly"
  duration: number
  steps: Step[]
  metric: string
  target: number
  successPercentage: number
  successEnabled: boolean
}

const habitContextReducer = (state: initialStateTypes, action: { type: string, payload: any }) => {
  switch (action.type) {
    case 'CREATE_HABIT':
      return action.payload
    case 'UPDATE_TITLE':
      return { ...state, title: action.payload }
    case 'UPDATE_FREQUENCY':
      return { ...state, frequency: action.payload }
    case 'UPDATE_DURATION':
      return { ...state, duration: action.payload }
    case 'ADD_STEP':
      return { ...state, steps: [...state.steps, action.payload] }
    case 'UPDATE_METRIC':
      return { ...state, metric: action.payload }
    case 'UPDATE_TARGET':
      return { ...state, target: action.payload }
    case 'UPDATE_SUCCESS_PERCENTAGE':
      return { ...state, successPercentage: action.payload }
    case 'UPDATE_SUCCESS_ENABLED':
      return { ...state, successEnabled: action.payload }
    default:
      return state
  }
}

const initialState: initialStateTypes = {
  title: '',
  frequency: 'daily',
  duration: 0,
  steps: [],
  metric: '',
  target: 0,
  successPercentage: 0,
  successEnabled: false,
}

const HabitContext = createContext<{
  state: initialStateTypes
  dispatch: React.Dispatch<{ type: string, payload: any }>
}>({
  state: {
    title: '',
    frequency: 'daily',
    duration: 0,
    steps: [],
    metric: '',
    target: 0,
    successPercentage: 0,
    successEnabled: false,
  },
  dispatch: () => { },
})

const HabitContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(habitContextReducer, initialState)

  return (
    <HabitContext.Provider value={{ state, dispatch }}>
      {children}
    </HabitContext.Provider>
  )
}

export const useHabitCtx = () => useContext(HabitContext)


export default HabitContextProvider