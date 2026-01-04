"use client"

import { useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Switch } from "../../../../components/ui/switch"
import { Trash2 } from "lucide-react"

interface HabitEditorModalProps {
  habit: any
  onClose: () => void
  onSave: (habit: any) => void
  onDelete: (id: string) => void
}

export function HabitEditorModal({ habit, onClose, onSave, onDelete }: HabitEditorModalProps) {
  const [form, setForm] = useState(habit)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = () => {
    onSave(form)
    onClose()
  }

  const handleDelete = () => {
    onDelete(habit.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-card border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Edit Habit</CardTitle>
              <CardDescription>Update your habit details</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Habit Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1.5"
              />
            </div>

            {/* Frequency & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Frequency</Label>
                <Select value={form.frequency} onValueChange={(v) => setForm({ ...form, frequency: v })}>
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
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: Number.parseInt(e.target.value) })}
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Measurement */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="metric">Metric</Label>
                <Input
                  id="metric"
                  value={form.measurement.metric}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      measurement: {
                        ...form.measurement,
                        metric: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="target">Target</Label>
                <Input
                  id="target"
                  type="number"
                  value={form.measurement.target}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      measurement: {
                        ...form.measurement,
                        target: Number.parseInt(e.target.value),
                      },
                    })
                  }
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Reminders */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Daily Reminders</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Email Notifications</Label>
                <Switch defaultChecked={false} />
              </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t">
              {!showDeleteConfirm ? (
                <Button variant="destructive" className="w-full" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Habit
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-foreground font-semibold">Are you sure? This action cannot be undone.</p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={handleDelete}>
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-6 border-t mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
