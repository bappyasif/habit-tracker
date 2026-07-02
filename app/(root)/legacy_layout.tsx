"use client"

import UserAuthCtxProvider from "@/context-reducers/userAuthCtx"
import {SessionProvider} from "next-auth/react"

export default function RootRoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionProvider>
      <UserAuthCtxProvider>
        {children}
      </UserAuthCtxProvider>
    </SessionProvider>
  )
}