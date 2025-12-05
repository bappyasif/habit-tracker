"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HabitEditorModal } from "@/app/settings/_components/habit-editor-modal"
import { mockHabits } from "@/lib/mock-data"
import { Edit2, LogOut, Bell, Globe, Eye } from "lucide-react"

export default function SettingsPage() {
  const [habits, setHabits] = useState(mockHabits)
  const [selectedEditHabit, setSelectedEditHabit] = useState<any>()
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

  const handleSaveHabit = (habit: any) => {
    setHabits(habits.map((h) => (h.id === habit.id ? habit : h)))
    setSelectedEditHabit(null)
  }

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter((h) => h.id !== id))
    setSelectedEditHabit(null)
  }

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and habits</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language */}
              <div>
                <Label className="mb-2 block font-semibold">Language</Label>
                <Select value={language} onValueChange={(v: any) => setLanguage(v)}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Theme */}
              <div>
                <Label className="mb-2 block font-semibold">Theme</Label>
                <Select value={theme} onValueChange={(v: any) => setTheme(v)}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>Control how you receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-semibold">Daily Reminders</Label>
                  <p className="text-sm text-muted-foreground mt-1">Get reminded about your daily habits</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-semibold">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground mt-1">Receive weekly summaries via email</p>
                </div>
                <Switch defaultChecked={false} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-semibold">Streak Alerts</Label>
                  <p className="text-sm text-muted-foreground mt-1">Get notified when a streak is at risk</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Privacy
              </CardTitle>
              <CardDescription>Control your data and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-semibold">Analytics</Label>
                  <p className="text-sm text-muted-foreground mt-1">Help us improve with anonymous usage data</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button variant="outline" className="w-full mt-4 bg-transparent">
                Download Your Data
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* Habit Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit2 className="w-5 h-5" />
                Your Habits
              </CardTitle>
              <CardDescription>Edit or delete your habits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition"
                  >
                    <div>
                      <p className="font-semibold">{habit.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {habit.frequency} • {habit.currentStreak} day streak
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setSelectedEditHabit(habit)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <p className="text-sm text-muted-foreground">alex@example.com</p>
                </div>
                <Button variant="destructive" className="w-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Habit Editor Modal */}
      {selectedEditHabit && (
        <HabitEditorModal
          habit={selectedEditHabit}
          onClose={() => setSelectedEditHabit(null)}
          onSave={handleSaveHabit}
          onDelete={handleDeleteHabit}
        />
      )}
    </>
  )
}
