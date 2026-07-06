import { useUserAuthCtx } from "@/context-reducers/userAuthCtx"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const useToCheckUserAuthAndRedirect = () => {
    const { state } = useUserAuthCtx()
    const { user } = state
    
    const router = useRouter()

    useEffect(() => {
        if (!user?.name) {
            router.push('/crossroad') // redirect to crossroad page if user is not authenticated
        } 
        else {
            router.push('/dashboard') // redirect to dashboard page if user is authenticated
        }
    }, [user])
}