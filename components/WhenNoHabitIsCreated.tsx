import Link from "next/link"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"

export const WhenNoHabitIsCreated = () => {
    return (
        <main className="flex flex-col items-center justify-center h-full w-full px-4 sm:px-6 lg:px-8 pb-20 md:py-8">
            <h2 className="text-2xl font-semibold text-gray-700">No Habit Created Yet</h2>
            <p className="text-gray-500 mt-2">Start by creating a new habit to track your progress.</p>
            <Link href="/create-habit" className="mt-4">
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 cursor-pointer">
                    Create Habit
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </Link>
        </main>
    )
}