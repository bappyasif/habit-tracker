import { authorizeUserInDb } from "@/server-calls/habits"

export const sendReuestToServerForUserAuthorization = async (user: { email: string, name: string, image: string }) => {
    authorizeUserInDb({
        email: user.email,
        name: user.name,
        image: user.image
    }).then((data) => {
        console.log("User authorization response:", data)
    }).catch((error) => {
        console.error("Error authorizing user:", error)
    })
}