import { toggleUserEmailNotificationsPermission } from "@/app/server-actions/notifications"
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { useUserNotificationsCtx } from "@/context-reducers/userNotificationsCtx"
import { useEffect } from "react"

export const useToToggleUserPermission = () => {
    const { state } = useUserNotificationsCtx()
    const {emailNotifications} = state

    const {state: authState} = useUserAuthCtx()

    useEffect(() => {
        const timer = setTimeout(() => {
            toggleUserEmailNotificationsPermission(authState?.user?.token ?? '')
        }, 2000)
        return () => clearTimeout(timer)
    }, [emailNotifications])
}