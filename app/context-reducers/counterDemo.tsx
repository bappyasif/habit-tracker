import { createContext, useContext, useReducer } from "react"

export const initialState = {count: 0}

export const counterReducer = (state = initialState, action: {type: string}) => {
    switch(action.type) {
        case 'INCREMENT':
            return {count: state.count + 1}
        case 'DECREMENT':
            return {count: state.count - 1}
        default:
            return state
    }
}


const CounterContextDemo = createContext<{
  state: typeof initialState
  dispatch: React.Dispatch<{type: string}>
}>({
  state: initialState,
  dispatch: () => null,
})

const CounterContextDemoProvider = ({children}: {children: React.ReactNode}) => {
  const [state, dispatch] = useReducer(counterReducer, initialState)

  return (
    <CounterContextDemo.Provider value={{state, dispatch}}>
      {children}
    </CounterContextDemo.Provider>
  )
}

export default CounterContextDemoProvider

export const useCounter = () => useContext(CounterContextDemo)