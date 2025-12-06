import { HabitCard } from "@/app/(root)/_components/habit-card"
import Link from "next/link"
import { content } from "../_data/content"

const sampleHabits = [
    { title: "Fitness", icon: "💪", description: "Health and endurance" },
    { title: "Drink Water", icon: "💧", description: "Stay hydrated daily" },
    { title: "Sleep 7 hr", icon: "😴", description: "Get quality rest" },
]

export const SampleCards = ({ language }: { language: "en" | "bn" }) => {
    const t = content[language]
    return (
        <div className="mt-16">
            <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">{t.quickStart}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleHabits.map((habit) => (
                    <Link key={habit.title} href="/create-habit">
                        <HabitCard {...habit} />
                    </Link>
                ))}
            </div>
        </div>
    )
}