"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { useEffect } from "react"
import { authorizeUserInDb } from "@/server-calls/habits"
import useFcmToken from "@/hooks/useFcmToken"

export function UserAuthToggleView() {
    const { data: session } = useSession()

    const { state: authState, dispatch: authDispatch } = useUserAuthCtx()

    const handleSignIn = () => {
        signIn()
    }

    const handleSignOut = () => {
        signOut()
    }

    const { requestPermission } = useFcmToken();

    useEffect(() => {
        if (session && session.user) {
            authorizeUserInDb({
                email: session.user.email ?? "",
                name: session.user.name ?? "",
                image: session.user.image ?? ""
            }).then((data) => {
                authDispatch({ type: "SET_AUTHENTICATED", payload: { ...data.data.user, token: data.data.access_token } })
                authState.user && requestPermission() // Request permission for push notifications after successful authentication
            }).catch((error) => {
                console.error("Error authorizing user:", error)
                authDispatch({ type: "SET_UNAUTHENTICATED" })
            })
        } else {
            authDispatch({ type: "SET_UNAUTHENTICATED" })
        }
    }, [session, authDispatch])

    if (session) {
        return (
            <div className="flex items-center w-3/4 gap-4">
                <span className="hidden xl:block text-lg">Signed in as {session.user?.name}</span>
                <br />
                <Button variant="secondary" onClick={() => handleSignOut()}>Sign out</Button>
            </div>
        )
    }

    return (
        <div className="flex items-center w-3/4 gap-4">
            <span className="hidden md:block">Not signed in</span>
            <Button onClick={() => handleSignIn()}>Sign in</Button>
        </div>
    )
}