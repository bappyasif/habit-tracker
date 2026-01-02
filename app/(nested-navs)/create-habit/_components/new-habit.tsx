import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2 } from "lucide-react"

export const NewHabit = () => {
    return (
        <div className="space-y-6">
            <div>
                <Label htmlFor="title">Habit Title</Label>
                <Input
                    id="title"
                    placeholder="e.g., Morning Workout"
                    className="mt-1.5"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Frequency</Label>
                    <Select
                        defaultValue="daily"
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
                        placeholder="e.g., 7"
                        className="mt-1.5"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <Label>Daily Steps</Label>
                    <Button size="sm" variant="outline" onClick={() => null}>
                        <Plus className="w-4 h-4 mr-1" /> Add Step
                    </Button>
                </div>
                <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                    {[1, 2].map((_, idx) => (
                        <div key={idx + 1} className="flex items-center gap-2 bg-card p-3 rounded-lg border">
                            <span className="text-sm font-semibold text-muted-foreground min-w-6">{idx + 1}.</span>
                            <Input
                                placeholder="Step title"
                                className="flex-1 h-8"
                            />
                            <Input
                                type="time"
                                placeholder="00:00"
                                className="w-24 h-8"
                            />
                            <Button
                                size="sm" variant="ghost"
                            // onClick={() => handleRemoveStep(step.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="metric">Metric</Label>
                    <Input
                        id="metric"
                        placeholder="e.g., minutes"
                        className="mt-1.5"
                    />
                </div>
                <div>
                    <Label htmlFor="target">Target</Label>
                    <Input
                        id="target"
                        type="number"
                        placeholder="e.g., 30"
                        className="mt-1.5"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label>Enable Success Definition</Label>
                    <Switch
                        defaultChecked={true}
                    />
                </div>
                {
                    (
                        <div>
                            <Label htmlFor="success">Success Percentage</Label>
                            <Input
                                id="success"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="e.g., 80"
                                className="mt-1.5"
                            />
                        </div>
                    )}
            </div>

            <div className="flex gap-3 pt-6 border-t mt-6">
                <Button variant="outline" onClick={() => null} className="flex-1 bg-transparent">
                    Cancel
                </Button>
                <Button onClick={() => null} className="flex-1">
                    Save Habit
                </Button>
            </div>
        </div>
    )
}