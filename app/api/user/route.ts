import { NextResponse } from "next/server"

export const GET = async (request: Request) => {
    const email = request.headers.get("email")

    const url = `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/v1/user/${email}`

    const res = await fetch(url)
    const data = await res.json()

    return NextResponse.json({
        message: "User route",
        data: data
    })
}