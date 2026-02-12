"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HabitCreationModal } from "@/app/(nested-navs)/create-habit/_components/habit-creation-modal"
import { useTrackCtx } from "@/context-reducers/trackCtx"

export default function CreateHabitPage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(true)

  const {dispatch, state} = useTrackCtx()

  const handleClose = () => {
    setShowModal(false)
    router.push("/dashboard")
  }

  const handleSave = (habit: any) => {
    handleClose()
    dispatch({type: "CREATE_HABIT", payload: habit})
  }

  return (
    showModal ? <HabitCreationModal onClose={handleClose} onSave={handleSave} /> : null 
  )
}
