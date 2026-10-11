import { TrackTypes } from "@/context-reducers/trackCtx"

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
        title: string;
        time: string;
        completed: boolean;
    }[];
    completedSteps: {
        id: string;
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