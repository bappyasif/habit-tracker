"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { useEffect } from "react"
// import { sendReuestToServerForUserAuthorization } from "@/utils"
import { authorizeUserInDb } from "@/server-calls/habits"

export function UserAuthToggleView() {
    const { data: session } = useSession()

    const { state: authState, dispatch: authDispatch } = useUserAuthCtx()

    // console.log("UserAuthToggleView session:", session)

    const handleSignIn = () => {
        signIn()
        // .then(() => {
        //     if (session) {
        //         sendReuestToServerForUserAuthorization({
        //         email: session.user?.email ?? "",
        //         name: session.user?.name ?? "",
        //         image: session.user?.image ?? ""
        //     })
        //     }
        // })
        // handleUserAuthToggle()
    }

    const handleSignOut = () => {
        signOut()
        // handleUserAuthToggle()
    }

    useEffect(() => {
        if (session && session.user) {
            // authDispatch({ type: "SET_AUTHENTICATED", payload: session.user })
            // sendReuestToServerForUserAuthorization({
            //     email: session.user?.email ?? "",
            //     name: session.user?.name ?? "",
            //     image: session.user?.image ?? ""
            // }).then((data) => {
            //     console.log("User authorization response:", data)
            //     authDispatch({ type: "SET_AUTHENTICATED", payload: session.user })
            //     console.log(authState, "authState from authToggleView")
            // }).catch((error) => {
            //     console.error("Error authorizing user:", error)
            //     authDispatch({ type: "SET_UNAUTHENTICATED" })
            // })
            authorizeUserInDb({
                email: session.user.email ?? "",
                name: session.user.name ?? "",
                image: session.user.image ?? ""
            }).then((data) => {
                console.log("User authorization response: from userAuthToggleView", data)
                authDispatch({ type: "SET_AUTHENTICATED", payload: data.data.user })
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