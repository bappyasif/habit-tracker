const KEY = "pending-focus-celebration"

type TransitionArgs = {
  wasAllDone: boolean
  isAllDone: boolean
  date: Date
}

export const markAnnouncementIfNeeded = ({
  wasAllDone,
  isAllDone,
  date,
}: TransitionArgs) => {
  const isToday = new Date().toDateString() === date.toDateString()
  
  if (!wasAllDone && isAllDone && isToday) {
    sessionStorage.setItem(KEY, date.toDateString())
  }
}

export const announceHabitFullyCompleted = (): boolean => {
  const pending = sessionStorage.getItem(KEY)

  if(!pending) return false

  sessionStorage.removeItem(KEY)

  return pending === new Date().toDateString()
}