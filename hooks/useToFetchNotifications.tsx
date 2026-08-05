import { fetchNotificationsFromBackend } from "@/app/server-actions/notifications";
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx";
import { useUserNotificationsCtx } from "@/context-reducers/userNotificationsCtx";
import { useEffect } from "react";

export const useToFetchNotifications = () => {
    const { state: authState } = useUserAuthCtx()
    const { dispatch } = useUserNotificationsCtx()

    const fetchNotifications = (token: string) => {
        fetchNotificationsFromBackend(token)
            .then(data => {
                const notifications = data?.notifications
                if (notifications?.length) {
                    dispatch({ type: "SET_NOTIFICATIONS", payload: notifications })
                }
            }).catch(err => console.log(err))
    }

    useEffect(() => {
        if (authState.user?.token) {
            fetchNotifications(authState.user.token)
        }
    }, [authState.user?.token])

    return {
        fetchNotifications
    }
}