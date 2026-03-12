import { TrackTypes } from "@/context-reducers/trackCtx"

export const getAllHabits = async () => {
    // const res = await fetch("http://127.0.0.1:8000/api/v1/habits/")
    const res = await fetch("/api/habits/")
    return res.json()
}

export const createHabit = async (habit: TrackTypes) => {
    const res = await fetch("/api/habits/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(habit)
    })
    return res.json()
}