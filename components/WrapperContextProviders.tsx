"use client"

import UserAuthCtxProvider from "@/context-reducers/userAuthCtx"
import { SessionProvider } from "next-auth/react"

export const WrapperContextProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <UserAuthCtxProvider>
        {children}
      </UserAuthCtxProvider>
    </SessionProvider>
  )
}