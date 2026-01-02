import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { TrackTypes, useTrackCtx } from "@/context-reducers/trackCtx"
import { Plus, Trash2 } from "lucide-react"

export const HabitEdit = (
    { habit, handleAddStep, handleUpdateStep, handleRemoveStep }
        : { habit: TrackTypes, handleAddStep: () => void, handleUpdateStep: (id: string, field: string, value: any) => void, handleRemoveStep: (id: string) => void }
) => {

    const { state: trackState, dispatch: trackDispatch } = useTrackCtx()

    return (
        <div className="space-y-6">
            {/* Title */}
            <div>
                <Label htmlFor="title">Habit Title</Label>
                <Input
                    id="title"
                    value={habit.title}
                    // onChange={(e) => setForm({ ...form, title: e.target.value })}
                    onChange={(e) => {
                        // dispatch({ type: "UPDATE_TITLE", payload: e.target.value })
                        trackDispatch({ 
                            type: 'UPDATE_HABIT_PAYLOAD', 
                            payload: { id: habit.id, data: { title: e.target.value } } 
                        })
                    }}
                    placeholder="e.g., Morning Workout"
                    className="mt-1.5"
                />
            </div>

            {/* Frequency and Duration */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Frequency</Label>
                    <Select
                        value={habit.frequency}
                        // onValueChange={(v: any) => setForm({ ...form, frequency: v })}
                        onValueChange={(v: any) => {
                            // dispatch({ type: "UPDATE_FREQUENCY", payload: v })
                            trackDispatch({ type: 'UPDATE_HABIT_PAYLOAD', payload: { id: habit.id, data: { frequency: v } } })
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
                        value={habit.duration}
                        // onChange={(e) => setForm({ ...form, duration: Number.parseInt(e.target.value) })}
                        onChange={(e) => {
                            // dispatch({ type: "UPDATE_DURATION", payload: Number.parseInt(e.target.value) })
                            trackDispatch({ type: 'UPDATE_HABIT_PAYLOAD', payload: { id: habit.id, data: { duration: Number.parseInt(e.target.value) } } })
                        }}
                        className="mt-1.5"
                    />
                </div>
            </div>

            {/* Steps */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <Label>Daily Steps</Label>
                    <Button size="sm" variant="outline" onClick={handleAddStep}>
                        <Plus className="w-4 h-4 mr-1" /> Add Step
                    </Button>
                </div>
                <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                    {habit.steps.map((step, idx) => (
                        <div key={step.id} className="flex items-center gap-2 bg-card p-3 rounded-lg border">
                            <span className="text-sm font-semibold text-muted-foreground min-w-6">{idx + 1}.</span>
                            <Input
                                placeholder="Step title"
                                value={step.title}
                                onChange={(e) => handleUpdateStep(step.id, "title", e.target.value)}
                                className="flex-1 h-8"
                            />
                            <Input
                                type="time"
                                value={step.time}
                                onChange={(e) => handleUpdateStep(step.id, "time", e.target.value)}
                                className="w-24 h-8"
                            />
                            <Button size="sm" variant="ghost" onClick={() => handleRemoveStep(step.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Measurement */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="metric">Metric</Label>
                    <Input
                        id="metric"
                        value={habit.measurement.metric}
                        // onChange={(e) => setForm({ ...form, metric: e.target.value })}
                        onChange={(e) => {
                            // dispatch({ type: "UPDATE_METRIC", payload: e.target.value })
                            // trackDispatch({ type: 'UPDATE_HABIT_PAYLOAD', payload: { id: habit.id, data: { metric: e.target.value } } })
                            trackDispatch({
                                type: 'UPDATE_HABIT_PAYLOAD', payload: {
                                    id: habit.id, data: {
                                        measurement: {
                                            target: habit.measurement.target,
                                            metric: e.target.value
                                        }
                                    }
                                }
                            })
                        }}
                        placeholder="e.g., minutes"
                        className="mt-1.5"
                    />
                </div>
                <div>
                    <Label htmlFor="target">Target</Label>
                    <Input
                        id="target"
                        type="number"
                        // value={state.target}
                        value={habit.measurement.target}
                        // onChange={(e) => setForm({ ...form, target: Number.parseInt(e.target.value) })}
                        onChange={(e) => {
                            // dispatch({ type: "UPDATE_TARGET", payload: Number.parseInt(e.target.value) })
                            trackDispatch({
                                type: 'UPDATE_HABIT_PAYLOAD', payload: {
                                    id: habit.id, data: {
                                        measurement: {
                                            target: Number.parseInt(e.target.value),
                                            metric: habit.measurement.metric
                                        }
                                    }
                                }
                            })
                        }}
                        className="mt-1.5"
                    />
                </div>
            </div>

            {/* Success Definition */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label>Enable Success Definition</Label>
                    <Switch
                        // checked={state.successEnabled}
                        checked={habit.successDefinition.enabled}
                        // onCheckedChange={(checked) => setForm({ ...form, successEnabled: checked })}
                        onCheckedChange={(checked) => {
                            // dispatch({ type: "UPDATE_SUCCESS_ENABLED", payload: checked })
                            trackDispatch({
                                type: 'UPDATE_HABIT_PAYLOAD', payload: {
                                    id: habit.id, data: {
                                        successDefinition: {
                                            enabled: checked,
                                            percentage: habit.successDefinition.percentage
                                        }
                                    }
                                }
                            })
                        }}
                    />
                </div>
                {
                    habit.successDefinition.enabled &&
                    // state.successEnabled && 
                    (
                        <div>
                            <Label htmlFor="success">Success Percentage</Label>
                            <Input
                                id="success"
                                type="number"
                                min="0"
                                max="100"
                                // value={state.successPercentage}
                                value={habit.successDefinition.percentage}
                                // onChange={(e) => setForm({ ...form, successPercentage: Number.parseInt(e.target.value) })}
                                onChange={(e) => {
                                    // dispatch({ type: "UPDATE_SUCCESS_PERCENTAGE", payload: Number.parseInt(e.target.value) })
                                    trackDispatch({
                                        type: 'UPDATE_HABIT_PAYLOAD', payload: {
                                            id: habit.id, data: {
                                                successDefinition: {
                                                    enabled: habit.successDefinition.enabled,
                                                    percentage: Number.parseInt(e.target.value)
                                                }
                                            }
                                        }
                                    })
                                }}
                                className="mt-1.5"
                            />
                        </div>
                    )}
            </div>
        </div>
    )
}