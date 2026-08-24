import { createContext, useContext, useReducer } from "react";

type UserNotification = {
    id: Number
    title: string
    description: string
    isRead: boolean
    createdAt: Date
}

type UserNotificationsCtxState = {
  notifications: UserNotification[],
  emailNotifications: boolean
}

const userNotificationsCtxReducer = (state: UserNotificationsCtxState, action: { type: string; payload?: any }): UserNotificationsCtxState => {
    switch (action.type) {
        case 'SET_NOTIFICATIONS':
            return {
                ...state,
                notifications: action.payload
            }
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [...state.notifications, action.payload]
            }
        
        case 'MARK_NOTIFICATION_AS_READ':
            return {
                ...state,
                notifications: state.notifications.map(notification => 
                    notification.id === action.payload ? { ...notification, isRead: true } : notification
                )
            }
        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter(notification => notification.id !== action.payload)
            }

        case 'TOGGLE_EMAIL_NOTIFICATIONS':
            return {
                ...state,
                emailNotifications: !state.emailNotifications
            }
        default:
            return state
    }
}

const initialUserNotificationsCtxState: UserNotificationsCtxState = {
    notifications: [],
    emailNotifications: true
}

const UserNotificationsCtx = createContext<{
    state: UserNotificationsCtxState
    dispatch: React.Dispatch<{ type: string; payload?: any }>
}>({
    state: initialUserNotificationsCtxState,
    dispatch: () => null
})

const UserNotificationsCtxProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(userNotificationsCtxReducer, initialUserNotificationsCtxState)

    return (
        <UserNotificationsCtx.Provider value={{ state, dispatch }}>
            {children}
        </UserNotificationsCtx.Provider>
    )
}

export default UserNotificationsCtxProvider

export const useUserNotificationsCtx = () => {
    return useContext(UserNotificationsCtx)
}