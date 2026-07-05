import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { se } from "date-fns/locale"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useToCheckUserAuthAndRedirect } from "./useToCheckUserAuthAndRedirect"
import { useRouter } from "next/navigation"

export const useToUpdateUserSession = () => {
    const {data:session} = useSession()
    const {dispatch, state} = useUserAuthCtx()

    // useToCheckUserAuthAndRedirect()
    const router = useRouter()

    useEffect(() => {
        console.log("useToUpdateUserSession: session", session, "state", state)
        if(state.isAuthenticated && !session) {
            router.push('/crossroad')
        } else if(!state.isAuthenticated && session) {
            router.push('/dashboard')
        }
    }, [session, state])

    useEffect(() => {
        if(!session) {
            dispatch({ type: "SET_UNAUTHENTICATED" })
            console.log("User session is null, dispatching SET_UNAUTHENTICATED")
        } else if(session?.user) {
            dispatch({ type: "SET_AUTHENTICATED", payload: session.user })
            console.log("User session is present, dispatching SET_AUTHENTICATED with payload:", session.user)
        }
    }, [session])
}