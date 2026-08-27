"use client"

import UserAuthCtxProvider from "@/context-reducers/userAuthCtx"
import { SessionProvider } from "next-auth/react"
import { PushNotificationsListener } from "./PushNotificationsListener"
import UserNotificationsCtxProvider from "@/context-reducers/userNotificationsCtx"
import { ThemeProvider } from "./theme-provider"
import { useEffect } from "react"
import { useTheme } from "next-themes"

export const WrapperContextProviders = ({ children }: { children: React.ReactNode }) => {
  const { setTheme } = useTheme()

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    setTheme(systemTheme)
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <UserAuthCtxProvider>
          <UserNotificationsCtxProvider>
            <PushNotificationsListener />
            {children}
          </UserNotificationsCtxProvider>
        </UserAuthCtxProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}