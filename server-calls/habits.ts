import { TrackTypes } from "@/context-reducers/trackCtx"

export const getAllHabits = async () => {
    // Ensure we don't crash if baseUrl is malformed
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/habits/`;
    
    try {
        const res = await fetch(url);
        if (!res.ok) return []; // Fallback empty array so build doesn't crash
        return res.json();
    } catch (error) {
        // During build time in CI, backend is offline. Return empty data safely.
        console.warn("Backend offline during build, returning empty habits.");
        return [];
    }
}

export const createHabit = async (habit: TrackTypes & { userId: number }) => {
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
        // note: string;
        title: string;
        time: string;
        completed: boolean;
    }[];
    completedSteps: {
        id: string;
        // note: string;
        title: string;
        time: string;
        completed: boolean;
    }[];
}) => {
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

const getBaseUrl = () => {
    // If we are in the browser, relative paths are fine
    if (typeof window !== 'undefined') return '';
    
    // If we are on the server (like during SSR or Build), we MUST use an absolute URL
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    
    // Fallback for local server runs
    return 'http://localhost:3000';
};

// send request to api with authorized outh response
export const authorizeUserInDb = async (user: { email: string; name: string; image: string }) => {
    const url = `${getBaseUrl()}/api/user/authorize`;
    
    const res = await fetch(
        url,
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })

    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to authorize user in db")
    }
    
    return res.json()
}

// get a user habits from db
export const getUserHabitsFromDb = async (userId: number, token: string) => {
    const url = `${getBaseUrl()}/api/user/habits`;

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })

    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to get user habits from db")
    }

    return res.json()
}

export const createHabitSecurely = async (habit: TrackTypes & { userId: number, token: string }) => {
    const res = await fetch("/api/user/habits/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${habit.token}`
        },
        body: JSON.stringify(habit)
    })
    return res.json()
}

export const deleteHabitSecurely = async (id: string, token: string) => {
    const res = await fetch(`/api/user/habits/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            id: id
        })
    })
    return res.json()
}

export const updateHabitSecurely = async (habit: TrackTypes & { userId: number, token: string }) => {
    const res = await fetch("/api/user/habits/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${habit.token}`
        },
        body: JSON.stringify(habit)
    })
    return res.json()
}

export const securelyCreateHabitDailyTimeline = async (habit: TrackTypes, token: string) => {
    const res = await fetch("/api/user/habits/timeline", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(habit)
    })

    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to create habit timeline")
    }

    return res.json()
}

export const securelyGetHabitDailyTimeline = async (habitId: string, token: string) => {
    const endpoint = `${getBaseUrl()}/api/user/habits/timeline?habitId=${habitId}`

    const res = await fetch(endpoint, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })

    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to fetch habit daily log timeline")
    }
    return res.json()
}

export const securelyUpdateHabitDailyTimeline = async (habit: {
    habitId: string;
    dateStamp: Date;
    totalSteps: number;
    steps: {
        id: string;
        // note: string;
        title: string;
        time: string;
        completed: boolean;
    }[];
    completedSteps: {
        id: string;
        // note: string;
        title: string;
        time: string;
        completed: boolean;
    }[];
}, token: string) => {

    const res = await fetch("/api/user/habits/timeline", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...habit })
    })

    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update habit daily log timeline")
    }

    return res.json()
}