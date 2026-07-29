"use client"

import UserAuthCtxProvider from "@/context-reducers/userAuthCtx"
import { SessionProvider } from "next-auth/react"
import { PushNotificationsListener } from "./PushNotificationsListener"
// import NotificationsProvider from "./NotificationsProvider"

export const WrapperContextProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <UserAuthCtxProvider>
        {/* <NotificationsProvider> */}
          <PushNotificationsListener />
          {children}
        {/* </NotificationsProvider> */}
      </UserAuthCtxProvider>
    </SessionProvider>
  )
}