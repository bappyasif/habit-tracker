import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authorizeUserInDb } from "@/server-calls/habits"
import { sendReuestToServerForUserAuthorization } from "@/utils"

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
            // // send request to db for user authorization record creation if not exists
            // authorizeUserInDb({
            //     email: session.user.email ?? "",
            //     name: session.user.name ?? "",
            //     image: session.user.image ?? ""
            // })
            sendReuestToServerForUserAuthorization({
                email: session.user?.email ?? "",
                name: session.user?.name ?? "",
                image: session.user?.image ?? ""
            })
        }
    }, [session])
}