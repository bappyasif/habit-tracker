import { Button } from "@/components/ui/button"
import { TrackTypes } from "@/context-reducers/trackCtx"
import { Wand2 } from "lucide-react"

export const HabitPreview = (
    { habit, handleRegenerateWithAI, isLoading, setStage }
        :
        {
            habit: TrackTypes, handleRegenerateWithAI: () => void,
            isLoading: boolean,
            setStage: (stage: "preview" | "edit") => void
        }
) => {
    return (
        <div className="space-y-6">
            {/* Habit Title */}
            <div>
                <h3 className="text-2xl font-bold mb-2">{habit.title}</h3>
                <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>📅 {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}</span>
                    <span>⏱️ {habit.duration} days</span>
                    <span>
                        🎯 {habit.measurement.target} {habit.measurement.metric}
                    </span>
                </div>
            </div>

            {/* Daily Steps */}
            <div>
                <h4 className="font-semibold mb-3">Daily Steps</h4>
                <div className="space-y-2 bg-muted/30 rounded-lg p-4">
                    {habit.steps.map((step, idx) => (
                        <div key={step.id} className="flex items-center gap-3">
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    {idx + 1}. {step.title}
                                </p>
                                <p className="text-xs text-muted-foreground">⏰ {step.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Measurement */}
            <div>
                <h4 className="font-semibold mb-2">Measurement</h4>
                <p className="text-sm text-muted-foreground">
                    Target:{" "}
                    <span className="font-semibold text-foreground">
                        {habit.measurement.target} {habit.measurement.metric}
                    </span>
                </p>
            </div>

            {/* Success Definition */}
            {habit.successDefinition.enabled && (
                <div className="bg-accent/10 rounded-lg p-4">
                    <p className="text-sm font-semibold text-primary">
                        Success Definition: {habit.successDefinition.percentage}% completion
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <Button
                    variant="outline"
                    onClick={handleRegenerateWithAI}
                    disabled={isLoading}
                    className="flex-1 bg-transparent"
                >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {isLoading ? "Regenerating..." : "Edit with AI"}
                </Button>
                <Button
                    onClick={() => setStage("edit")}
                    variant="outline"
                    className="flex-1"
                >
                    Manual Edit
                </Button>
            </div>
        </div>
    )
}