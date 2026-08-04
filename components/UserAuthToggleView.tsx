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

    const {  requestPermission } = useFcmToken();

    useEffect(() => {
        if (session && session.user) {
            authorizeUserInDb({
                email: session.user.email ?? "",
                name: session.user.name ?? "",
                image: session.user.image ?? ""
            }).then((data) => {
                authDispatch({ type: "SET_AUTHENTICATED", payload: { ...data.data.user, token: data.data.access_token } })
                requestPermission() // Request permission for push notifications after successful authentication
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
                {/* <TestFcmPushNotification /> */}
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

// const TestFcmPushNotification = () => {
//     const {  requestPermission, token } = useFcmToken();

//     return (
//         <div>
//             <button onClick={requestPermission} className="p-2 bg-blue-600">
//                 Enable Push Notifications!!
//             </button>
//             {token && <p className="text-xs text-green-600 mt-2">Notifications Enabled!</p>}
//         </div>
//     );
// }