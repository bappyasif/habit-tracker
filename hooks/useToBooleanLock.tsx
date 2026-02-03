import { useState } from "react"

export const useToBooleanLock = () => {
    const [lock, setLock] = useState(false)

    const toggleLock = () => {
        setLock(v => !v)
    }

    return { lock, toggleLock }
}