import { useCounter } from "@/context-reducers/counterDemo";

export const CounterDemo = () => {
    const { state, dispatch } = useCounter();

    return (
        <div>
            <h1>Counter Demo</h1>
            <p>Count: {state.count}</p>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
            <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement</button>        
        </div>
    )
}