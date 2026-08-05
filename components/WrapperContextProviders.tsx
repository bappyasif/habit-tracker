"use client"

import UserAuthCtxProvider from "@/context-reducers/userAuthCtx"
import { SessionProvider } from "next-auth/react"
import { PushNotificationsListener } from "./PushNotificationsListener"
import UserNotificationsCtxProvider from "@/context-reducers/userNotificationsCtx"

export const WrapperContextProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <UserAuthCtxProvider>
          <UserNotificationsCtxProvider>
            <PushNotificationsListener />
            {children}
          </UserNotificationsCtxProvider>
      </UserAuthCtxProvider>
    </SessionProvider>
  )
}