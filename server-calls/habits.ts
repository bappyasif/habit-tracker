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

export const updateHabit = async (habit: TrackTypes) => {
    const res = await fetch("/api/habits/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(habit)
    })
    return res.json()
}

export const deleteHabit = async (id: string) => {
    const res = await fetch(`/api/habits/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id
        })
    })
    return res.json()
}

export const createHabitWeeklyTimeline = async (habit: TrackTypes) => {
    const res = await fetch("/api/habits/timeline/weekly", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(habit)
    })
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to create habit timeline")
    }
    return res.json()
}

export const createHabitDailyTimeline = async (habit: TrackTypes) => {
    const res = await fetch("/api/habits/timeline", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(habit)
    })
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to create habit timeline")
    }
    return res.json()
}

export const getHabitDailyTimeline = async (habitId: string) => {
    const res = await fetch(`/api/habits/timeline?habitId=${habitId}`)
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to fetch habit daily log timeline")
    }
    return res.json()
}

export const updateHabitDailyTimeline = async (habit: {
    habitId: string;
    dateStamp: Date;
    totalSteps: number;
    steps: {
        id: string;
        note: string;
        title: string;
        time: string;
        completed: boolean;
    }[];
    completedSteps: {
        id: string;
        note: string;
        title: string;
        time: string;
        completed: boolean;
    }[];
}) => {
    console.log("Updating habit daily timeline with data:", habit)
    const res = await fetch("/api/habits/timeline", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...habit })
    })
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update habit daily log timeline")
    }
    return res.json()
}