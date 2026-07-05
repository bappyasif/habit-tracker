import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const useToCheckUserAuthAndRedirect = () => {
    const { state } = useUserAuthCtx()
    const { user } = state
    console.log("useToCheckUserAuthAndRedirect: user", user, state)
    const router = useRouter()

    useEffect(() => {
        if (!user?.name) {
            console.log("User is not authenticated, redirecting to crossroad page...")
            router.push('/crossroad') // redirect to crossroad page if user is not authenticated
        } 
        else {
            console.log("User is authenticated, redirecting to dashboard page...")
            router.push('/dashboard') // redirect to dashboard page if user is authenticated
        }
    }, [user])
}