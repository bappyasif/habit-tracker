import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authorizeUserInDb } from "@/server-calls/habits"

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
            authorizeUserInDb({
                email: session.user.email ?? "",
                name: session.user.name ?? "",
                image: session.user.image ?? ""
            }).then((authorizedUser) => {
                dispatch({ type: "SET_AUTHENTICATED", payload: {...authorizedUser.data.user, token: authorizedUser.data.access_token} })
            }).catch((error) => {
                console.error("Error authorizing user:", error)
                dispatch({ type: "SET_UNAUTHENTICATED" })
            })

        }
    }, [session])
}