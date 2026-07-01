"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"

export function UserAuthToggleView() {
    const { data: session } = useSession()

    if (session) {
        return (
            <div className="flex items-center w-3/4 gap-4">
                <span className="text-lg">Signed in as {session.user?.name}</span>
                <br />
                <Button onClick={() => signOut()}>Sign out</Button>
            </div>
        )
    }

    return (
        <div className="flex items-center w-3/4 gap-4">      
            <span className="">Not signed in</span>
            <Button onClick={() => signIn()}>Sign in</Button>
        </div>
    )
}