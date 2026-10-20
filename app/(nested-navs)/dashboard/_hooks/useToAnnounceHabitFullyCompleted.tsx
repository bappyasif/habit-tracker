import { sendPushNotificationsToUserWhenFullyCompletedHabitStepsForDay } from "@/app/server-actions/notifications"
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { announceHabitFullyCompleted } from "@/utils/focus-announcement"
import { useEffect } from "react"

export const useToAnnounceHabitFullyCompleted = () => {
    const {state: aujthState} = useUserAuthCtx()
    const token = aujthState?.user?.token!

    useEffect(() => {
        if(!token) return

        if(!announceHabitFullyCompleted()) return

        sendPushNotificationsToUserWhenFullyCompletedHabitStepsForDay(token, "Congrats!", "You have completed all of your habit steps for today!").catch(err => console.log(err))
    }, [token])
}