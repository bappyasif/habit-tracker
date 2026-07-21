import { createContext, useContext, useReducer } from "react"

type UserAuthCtxState = {
  isAuthenticated: boolean
  user: {
    id: number
    name: string
    email: string
    image?: string
    token?: string
  } | null
}

const userAuthCtxReducer = (state: UserAuthCtxState, action: { type: string; payload?: any }): UserAuthCtxState => {
    switch (action.type) {
        case 'SET_AUTHENTICATED':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload
            }
        case 'SET_UNAUTHENTICATED':
            return {
                ...state,
                isAuthenticated: false,
                user: null
            }
        case 'TOGGLE_AUTHENTICATION':
            return {
                ...state,
                isAuthenticated: !state.isAuthenticated,
                user: state.isAuthenticated ? null : action.payload
            }

        default:
            return state
    }
}

const initialUserAuthCtxState: UserAuthCtxState = {
    isAuthenticated: false,
    user: null
}

const UserAuthCtx = createContext<{
    state: UserAuthCtxState
    dispatch: React.Dispatch<{ type: string; payload?: any }>
}>({
    state: initialUserAuthCtxState,
    dispatch: () => null
})

const UserAuthCtxProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(userAuthCtxReducer, initialUserAuthCtxState)

    return (
        <UserAuthCtx.Provider value={{ state, dispatch }}>
            {children}
        </UserAuthCtx.Provider>
    )
}

export default UserAuthCtxProvider

const useUserAuthCtx = () => {
    const context = useContext(UserAuthCtx)
    if (context === undefined) {
        throw new Error('useUserAuthCtx must be used within a UserAuthCtxProvider')
    }
    return context
}

export { useUserAuthCtx }