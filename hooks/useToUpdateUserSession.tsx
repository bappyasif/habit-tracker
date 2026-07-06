import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { se } from "date-fns/locale"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useToCheckUserAuthAndRedirect } from "./useToCheckUserAuthAndRedirect"
import { useRouter } from "next/navigation"

export const useToUpdateUserSession = () => {
    const {data:session} = useSession()
    const {dispatch, state} = useUserAuthCtx()

    const router = useRouter()

    useEffect(() => {
        if(state.isAuthenticated && !session) {
            router.push('/crossroad')
        } else if(!state.isAuthenticated && session) {
            router.push('/dashboard')
        }
    }, [session, state])

    useEffect(() => {
        if(!session) {
            dispatch({ type: "SET_UNAUTHENTICATED" })
        } else if(session?.user) {
            dispatch({ type: "SET_AUTHENTICATED", payload: session.user })
        }
    }, [session])
}