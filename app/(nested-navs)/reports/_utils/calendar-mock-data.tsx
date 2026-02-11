export const mockCalnderData = () => {
    const month = new Date() // Current month
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []    

    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(month.getFullYear(), month.getMonth(), i))
    }

    return { days }
}

export const mockCalendarHeatmapDataWithValues = () => {
    const currentMonth = new Date()
    const heatmapData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1),
        value: Math.floor(Math.random() * 100),
    }))

    return {heatmapData}
}