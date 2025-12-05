"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HabitCreationModal } from "@/app/create-habit/_components/habit-creation-modal"

export default function CreateHabitPage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(true)

  const handleClose = () => {
    setShowModal(false)
    router.push("/dashboard")
  }

  const handleSave = (habit: any) => {
    console.log("Habit saved:", habit)
    handleClose()
  }

  return <>{showModal && <HabitCreationModal onClose={handleClose} onSave={handleSave} />}</>
}
