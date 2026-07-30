"use client"

import UserAuthCtxProvider from "@/context-reducers/userAuthCtx"
import { SessionProvider } from "next-auth/react"
import { PushNotificationsListener } from "./PushNotificationsListener"

export const WrapperContextProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <UserAuthCtxProvider>
          <PushNotificationsListener />
          {children}
      </UserAuthCtxProvider>
    </SessionProvider>
  )
}