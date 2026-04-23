import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Steps, TrackTypes, useTrackCtx } from "@/context-reducers/trackCtx"
import { createHabit } from "@/server-calls/habits"
import { Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const NewHabit = () => {
    const [habit, setHabit] = useState<TrackTypes>({
        id: "",
        title: "",
        description: "",
        frequency: "daily",
        duration: 0,
        measurement: {
            metric: "minutes",
            target: 0,
        },
        steps: [],
        successDefinition: {
            enabled: false,
            percentage: 0,
        },
        createdAt: new Date(),
        currentStreak: 0,
        totalCompleted: 0
    })

    const { state, dispatch } = useTrackCtx()

    const router = useRouter()

    const saveToDb = (habitData: TrackTypes) => {
        createHabit(habitData).then(data => {
          console.log(data, "created habit")
        }).catch(err => console.log(err))
      }

    const handleSave = () => {
        if(habit.title === "") {
            alert("Please enter habit details correctly")
            return
        }

        saveToDb({...habit, id: (state.habits.length + 1).toString()})

        dispatch({ type: "CREATE_HABIT", payload: {...habit, id: (state.habits.length + 1).toString(), createdAt: new Date(), currentStreak: 0, totalCompleted: 0} })
        
        router.push("/dashboard")
    }

    const handleCancel = () => {
        dispatch({ type: "UPDATE_HABIT_VIEWING", payload: -1 })
        router.push("/dashboard")
    }

    const handleUpdateSteps = (newSteps: Steps[]) => {
        setHabit({ ...habit, steps: newSteps })
    }

    return (
        <div className="space-y-6">
            <div>
                <Label htmlFor="title">Habit Title</Label>
                <Input
                    id="title"
                    required
                    value={habit.title}
                    onChange={e => {
                        const t = e.target.value
                        const d = { "title": t }
                        setHabit({ ...habit, ...d })

                    }}
                    placeholder="e.g., Morning Workout"
                    className="mt-1.5"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Frequency</Label>
                    <Select
                        required
                        // defaultValue="daily"
                        value={habit.frequency}
                        onValueChange={e => {
                            const f = e as "daily" | "weekly" | "monthly"
                            const d = { "frequency": f }
                            setHabit({ ...habit, ...d })
                        }}
                    >
                        <SelectTrigger className="mt-1.5">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="duration">Duration (days)</Label>
                    <Input
                        id="duration"
                        type="number"
                        required
                        min={1}
                        placeholder="e.g., 7"
                        value={habit.duration}
                        onChange={e => {
                            const d = Number.parseInt(e.target.value)
                            const dd = { "duration": d }
                            setHabit({ ...habit, ...dd })
                        }}
                        className="mt-1.5"
                    />
                </div>
            </div>

            <HandleSteps handleUpdateSteps={handleUpdateSteps} />

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="metric">Metric</Label>
                    <Input
                        id="metric"
                        placeholder="e.g., minutes"
                        required
                        value={habit.measurement.metric}
                        onChange={e => {
                            const m = e.target.value
                            const d = { "measurement": { "metric": m, "target": habit.measurement.target } }
                            setHabit({ ...habit, ...d })
                        }}
                        className="mt-1.5"
                    />
                </div>
                <div>
                    <Label htmlFor="target">Target</Label>
                    <Input
                        id="target"
                        type="number"
                        placeholder="e.g., 30"
                        required
                        value={habit.measurement.target}
                        onChange={e => {
                            const t = Number.parseInt(e.target.value || "0")
                            const d = { "measurement": { "target": t, "metric": habit.measurement.metric } }
                            setHabit({ ...habit, ...d })
                        }}
                        className="mt-1.5"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-6 border-t mt-6">
                <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                    Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1">
                    Save Habit
                </Button>
            </div>
        </div>
    )
}

const HandleSteps = ({handleUpdateSteps}: {handleUpdateSteps: (newSteps: Steps[]) => void}) => {
    const [steps, setSteps] = useState<Steps[]>([{ id: "1", title: "Step 1", time: "00:00", completed: false }])

    const handleRemoveStep = (id: string) => {
        setSteps(steps.filter(s => s.id !== id))
    }

    const addEmptyStep = () => {
        setSteps([...steps, { id: (steps.length + 1).toString(), title: "", time: "00:00", completed: false }])
    }

    const handleSave = () => {
        handleUpdateSteps(steps)
    }

    useEffect(() => {
        handleSave()
    }, [steps])

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <Label>Daily Steps</Label>
                <Button size="sm" variant="outline" onClick={addEmptyStep}>
                    <Plus className="w-4 h-4 mr-1" /> Add Step
                </Button>
            </div>
            <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                {
                    steps
                        .map((step) => (
                            <div key={step.id} className="flex items-center gap-2 bg-card p-3 rounded-lg border">
                                <span className="text-sm font-semibold text-muted-foreground min-w-6">{step.id}.</span>
                                <Input
                                    placeholder="Step title"
                                    value={step.title}
                                    onChange={e => {
                                        const d = { "title": e.target.value }
                                        setSteps(steps.map(s => s.id === step.id ? { ...s, ...d } : s))
                                    }}
                                    className="flex-1 h-8"
                                />
                                <Input
                                    type="time"
                                    placeholder="00:00"
                                    value={step.time}
                                    onChange={e => {
                                        const d = { "time": e.target.value }
                                        setSteps(steps.map(s => s.id === step.id ? { ...s, ...d } : s))
                                    }}
                                    className="w-24 h-8"
                                />
                                <Button
                                    size="sm" variant="ghost"
                                onClick={() => handleRemoveStep(step.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
            </div>
        </div>
    )
}