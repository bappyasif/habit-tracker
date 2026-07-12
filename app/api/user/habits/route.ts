import { NextResponse } from "next/server"

export const GET = async (request: Request) => {
    const url_version = new URL(request.url)
    const userId = url_version.searchParams.get('userId')
    // const userId = request.headers.get("userId")
    console.log(userId, "!!userId!!")

    if(!userId) {
        return NextResponse.json({
            message: "User ID is required"
        })
    }

    // const url = `http://0.0.0.0:8000/api/v1/user/${userId}/habits`
    
    // const url = `http://0.0.0.0:8000/api/v1/user/habits/${userId}`
    const url = `http://0.0.0.0:8000/api/v1/user-habits/${userId}`

    const res = await fetch(url)
    const data = await res.json()

    return NextResponse.json({
        message: "User habits route is successfully fetched",
        data: data
    })
}