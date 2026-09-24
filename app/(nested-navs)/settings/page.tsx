"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockHabits } from "@/lib/mock-data"
import { Edit2, LogOut, Bell, Globe, Eye, Trash2, Sun, Moon, Cog } from "lucide-react"
import { HabitEditorModal } from "./_components/habit-editor-modal"
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { signOut } from "next-auth/react"
import { useTrackCtx } from "@/context-reducers/trackCtx"
import { useRouter } from "next/navigation"
import { deleteHabitSecurely } from "@/server-calls/habits"
import { sendPushNotificationsToUserWhenDeletedHabit } from "@/app/server-actions/notifications"
import { useToFetchNotifications } from "@/hooks/useToFetchNotifications"
import { useUserNotificationsCtx } from "@/context-reducers/userNotificationsCtx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { sendRequestToDeleteUserAccount } from "@/app/server-actions"

export default function SettingsPage() {
  const [habits, setHabits] = useState(mockHabits)
  const [selectedEditHabit, setSelectedEditHabit] = useState<any>()

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
      <main className="w-full mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="my-4">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and habits</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account */}
          <AccountSettings />

          {/* Habit Management */}
          <HabitsManagement />

          {/* Preferences */}
          <Preferences />
          
          {/* Notifications */}
          <Notifications />

        </div>
        <ThemeMode />
        {/* Privacy */}
        <Privacy />
        <div className="h-10 md:hidden" />
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

const ThemeMode = () => {
  const { setTheme, themes, theme } = useTheme()

  const nextTheme =
    theme === "dark" ? "light" : theme === "light" ? "system" : "dark"

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="w-5 h-5" />
          Theme Mode
        </CardTitle>
        <CardDescription>Control your theme by toggling</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-accent">
        {
          theme === "dark" ? (
            <p className="text-sm text-muted-foreground">Dark Mode</p>
          ) : theme === "light" ? (
            <p className="text-sm text-muted-foreground">Light Mode</p>
          ) : (
            <p className="text-sm text-muted-foreground">System Mode</p>
          )
        }
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(nextTheme)}
          className="w-full"
        >
          {theme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : theme === "light" ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Cog className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </CardContent>
    </Card>
  )
}

const Privacy = () => {
  const { state: authState } = useUserAuthCtx()

  const handleDeleteAccount = () => {
    const prompt = window.confirm("Are you sure you want to delete your account? This action cannot be undone.")

    if (!prompt) return

    const token = authState?.user?.token!

    sendRequestToDeleteUserAccount(token)
      .then(async res => {
        console.log(res)
        await signOut({callbackUrl: "/"})
        console.log("Account deleted successfully.")
      })
      .catch(err => console.log(err))
  }

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Eye className="w-5 h-5" />
          Dangerous Zone
        </CardTitle>
        <CardDescription>Control your account with us</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="secondary" className="w-full bg-transparent hover:bg-destructive cursor-pointer hover:text-secondary" onClick={handleDeleteAccount}>
          <span>Delete Account</span>
        </Button>
      </CardContent>
    </Card>
  )
}

const Notifications = () => {
  const { state, dispatch } = useUserNotificationsCtx()
  const { emailNotifications } = state

  useEffect(() => {
    localStorage.setItem('emailNotifications', emailNotifications.toString())
  }, [emailNotifications])

  console.log(emailNotifications, "emailNotifications")

  return (
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
            <Label className="font-semibold">Email Notifications</Label>
            <p className="text-sm text-muted-foreground mt-1">Receive weekly summaries via email</p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={() => {
              dispatch({
                type: 'TOGGLE_EMAIL_NOTIFICATIONS'
              })
              console.log(emailNotifications, "emailNotifications")
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

const Preferences = () => {
  const [language, setLanguage] = useState<"en" | "bn">("en")

  return (
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
            </CardContent>
          </Card>
  )
}

const HabitsManagement = () => {
  const { state, dispatch } = useTrackCtx()
  const { habits } = state

  const router = useRouter()

  const handleEdit = (habitId: number) => {
    dispatch({
      type: 'UPDATE_HABIT_VIEWING',
      payload: habitId
    })

    router.push(`/create-habit`)
  }

  const { state: authState } = useUserAuthCtx()

  const { fetchNotifications } = useToFetchNotifications()

  const sendNotificationOnDelete = () => {
    const token = authState?.user?.token!
    // send notification to user that habit is deleted successfully
    sendPushNotificationsToUserWhenDeletedHabit(token)
      .then(res => {
        // console.log(res)
        fetchNotifications(token)
      })
      .catch(err => console.log(err))
  }

  const deleteHabitFromDb = async (id: string) => {
    try {
      const token = authState?.user?.token!
      await deleteHabitSecurely(id, token)
      console.log("successfully deleted")
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = (habitId: number) => {
    dispatch({
      type: 'DELETE_HABIT',
      payload: habitId
    })
    deleteHabitFromDb(habitId.toString())
    sendNotificationOnDelete()
  }

  return (
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
              <div className="flex justify-center gap-2">
                <Button size="sm" variant="outline"
                  onClick={() => handleEdit(Number(habit.id))}
                >
                  <Edit2 className="w-4 h-4" />
                  {/* Edit */}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(Number(habit.id))}>
                  <Trash2 className="w-4 h-4" />
                  {/* Delete */}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


const AccountSettings = () => {
  const { state: userState } = useUserAuthCtx()
  const user = userState.user

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your account: {user?.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold">Email</p>
            <p className="text-sm text-muted-foreground">{user?.email || 'N/A'}</p>
          </div>
          <Button variant="destructive" className="w-full" onClick={() => handleSignOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}