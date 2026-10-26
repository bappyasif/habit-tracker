import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressRing } from "./progress-ring"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { useTrackCtx } from "@/context-reducers/trackCtx"
import { useToUpdateHabitStepsCompletion } from "../_hooks/useToUpdateHabitStepsCompletion"
// import { sendPushNotificationsToUserWhenFullyCompletedHabitStepsForDay } from "@/app/server-actions/notifications"
// import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
// import { useEffect } from "react"
import { useToAnnounceHabitFullyCompleted } from "../_hooks/useToAnnounceHabitFullyCompleted"
import { useEffect, useRef } from "react"


export const TodaysFocus = () => {
  const { updatedHabit } = useToUpdateHabitStepsCompletion();

  // 1. Act as a "Memory" for the UI to prevent flickering
  const habitMemory = useRef(updatedHabit);

  // 2. Update memory ONLY when we have a valid habit object
  useEffect(() => {
    if (updatedHabit) {
      habitMemory.current = updatedHabit;
    }
  }, [updatedHabit]);

  // 3. Fallback to cached memory if current hook execution is undefined
  const currentHabit = updatedHabit || habitMemory.current;

  // 4. LOADING GUARD: Only shows on absolute initial mount if everything is missing
  if (!currentHabit || !currentHabit.steps) {
    return <div className="h-72 w-full animate-pulse bg-muted rounded-xl" />;
  }

  // 5. Calculations
  const completedSteps = currentHabit.steps.filter((s) => s.completed).length;
  const totalSteps = currentHabit.steps.length;
  const percentile = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const nextStep = currentHabit.steps.find((s) => !s.completed);

  useToAnnounceHabitFullyCompleted();

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl xl:text-3xl sm:text-left md:text-center">
          Current Focus: {currentHabit.title}
        </CardTitle>
        <CardDescription className="sm:text-left md:text-center">
          Complete your habit and build momentum
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-around xl:justify-center mb-6">
          <ProgressRing percentage={percentile} />
          <div className="flex flex-col ml-6">
            {/* <h3 className="font-semibold mb-4">Next Step</h3> */}
            {nextStep ? (
              <div className="space-y-2">
                <h3 className="font-semibold mb-4">Next Step</h3>
                <p className="text-lg font-bold">{nextStep.title}</p>
                <p className="text-sm text-muted-foreground">
                  ⏰ {new Date(nextStep.time).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour12: false, hour: "numeric", minute: "numeric" })}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="font-semibold mb-4">Next Step</h3>
                <p className="text-lg font-bold text-accent">All done for today! 🎉</p>
              </div>
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
  );
};

// export const TodaysFocus = () => {
//   const { updatedHabit } = useToUpdateHabitStepsCompletion()

//   // 1. Fallback logic: if no updated habit, you need a default or a loading state
//   // If you have access to the habits list, use: updatedHabit || habits[0]
//   const currentHabit = updatedHabit;

//   // 2. LOADING GUARD: This stops the flicker. 
//   // It prevents the component from rendering the Card with 'undefined' data.
//   if (!currentHabit || !currentHabit.steps) {
//     return <div className="h-72 w-full animate-pulse bg-muted rounded-xl" />;
//     // Or return null;
//   }

//   // 3. Memoize calculations to keep the UI snappy
//   const completedSteps = currentHabit.steps.filter((s) => s.completed).length;
//   const totalSteps = currentHabit.steps.length;
//   const percentile = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
//   const nextStep = currentHabit.steps.find((s) => !s.completed);


//   useToAnnounceHabitFullyCompleted()

//   return (
//     <Card className="border-2 border-primary/20">
//       <CardHeader>
//         <CardTitle className="text-xl md:text-2xl xl:text-3xl sm:text-left md:text-center">
//           Current Focus: {currentHabit.title}
//         </CardTitle>
//         <CardDescription className="sm:text-left md:text-center">
//           Complete your habit and build momentum
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="flex items-center justify-around xl:justify-center mb-6">
//           <ProgressRing percentage={percentile} />
//           <div className="flex flex-col ml-6">
//             <h3 className="font-semibold mb-4">Next Step</h3>
//             {nextStep ? (
//               <div className="space-y-2">
//                 <p className="text-lg font-bold">{nextStep.title}</p>
//                 <p className="text-sm text-muted-foreground">
//                   ⏰ {new Date(nextStep.time).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour12: false, hour: "numeric", minute: "numeric" })}
//                 </p>
//               </div>
//             ) : (
//               <p className="text-lg font-bold text-accent">All done for today! 🎉</p>
//             )}
//           </div>
//         </div>
//         <Link href="/track">
//           <Button className="w-full">
//             <CheckCircle2 className="w-4 h-4 mr-2" />
//             Log Progress
//           </Button>
//         </Link>
//       </CardContent>
//     </Card>
//   );
// }