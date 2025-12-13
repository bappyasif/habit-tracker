"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HabitCreationModal } from "@/app/create-habit/_components/habit-creation-modal"
import HabitContextProvider, { useHabitCtx } from "../../context-reducers/habitCtxr"

export default function CreateHabitPage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(true)

  const {dispatch} = useHabitCtx()

  const handleClose = () => {
    setShowModal(false)
    router.push("/dashboard")
  }

  const handleSave = (habit: any) => {
    console.log("Habit saved:", habit)
    handleClose()
    dispatch({type: "CREATE_HABIT", payload: habit})
  }

  return (
    <HabitContextProvider>
      {showModal ? <HabitCreationModal onClose={handleClose} onSave={handleSave} /> : null}
    </HabitContextProvider>
  )
}
