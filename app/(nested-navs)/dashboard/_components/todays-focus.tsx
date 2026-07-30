import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressRing } from "./progress-ring"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { useTrackCtx } from "@/context-reducers/trackCtx"
import { useToUpdateHabitStepsCompletion } from "../_hooks/useToUpdateHabitStepsCompletion"
import { sendPushNotificationsToUserWhenFullyCompletedHabitStepsForDay } from "@/app/server-actions/notifications"
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { useEffect } from "react"

export const TodaysFocus = () => {
  const { state } = useTrackCtx()

  const { habits } = state

  const currentHabit = useToUpdateHabitStepsCompletion().updatedHabit || habits[0]

  const percentile = Math.round(
    (currentHabit.steps.filter((s) => s.completed).length / currentHabit.steps.length) * 100,
  )

  const { state: authState } = useUserAuthCtx()

  useEffect(() => {
    if (percentile == 100) {
      sendPushNotificationsToUserWhenFullyCompletedHabitStepsForDay(authState?.user?.token!, "Congrats!", "You have completed your habit for today!").then(res => console.log(res)).catch(err => console.log(err))
    }
  }, [percentile, authState])

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Today's Focus: {currentHabit.title}</CardTitle>
        <CardDescription>Complete your habit and build momentum</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <ProgressRing
            percentage={percentile}
          // percentage={Math.round(
          //   (currentHabit.steps.filter((s) => s.completed).length / currentHabit.steps.length) * 100,
          // )}
          />
          <div className="flex-1 ml-6">
            <h3 className="font-semibold mb-4">Next Step</h3>
            {currentHabit.steps.find((s) => !s.completed) ? (
              <div className="space-y-2">
                <p className="text-lg font-bold">{currentHabit.steps.find((s) => !s.completed)?.title}</p>
                <p className="text-sm text-muted-foreground">
                  ⏰ {currentHabit.steps.find((s) => !s.completed)?.time}
                </p>
              </div>
            ) : (
              <p className="text-lg font-bold text-accent">All done for today! 🎉</p>
            )}
          </div>
        </div>
        <Link href="/track">
          <Button className="w-full">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Log Progress
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}