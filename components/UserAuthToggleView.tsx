"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { useEffect } from "react"

export function UserAuthToggleView() {
    const { data: session } = useSession()

    const { state: authState, dispatch: authDispatch } = useUserAuthCtx()

    const handleUserAuthToggle = () => {
        authDispatch({ type: "TOGGLE_AUTHENTICATION", payload: session?.user })
        console.log("User auth state toggled?:", authState, session?.user)
    }

    const handleSignIn = () => {
        signIn()
        // handleUserAuthToggle()
    }

    const handleSignOut = () => {
        signOut()
        // handleUserAuthToggle()
    }

    useEffect(() => {
        if (session) {
            authDispatch({ type: "SET_AUTHENTICATED", payload: session.user })
        } else {
            authDispatch({ type: "SET_UNAUTHENTICATED" })
        }
    }, [session, authDispatch])

    if (session) {
        return (
            <div className="flex items-center w-3/4 gap-4">
                <span className="text-lg">Signed in as {session.user?.name}</span>
                <br />
                <Button onClick={() => handleSignOut()}>Sign out</Button>
            </div>
        )
    }

    return (
        <div className="flex items-center w-3/4 gap-4">      
            <span className="">Not signed in</span>
            <Button onClick={() => handleSignIn()}>Sign in</Button>
        </div>
    )
}