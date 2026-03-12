import { NextResponse } from "next/server"

export const GET = async () => {
    const res = await fetch("http://0.0.0.0:8000/api/v1/habits/all")
    const data = await res.json()
    console.log(data, "!!data!!")
    return NextResponse.json({
        message: "Habits route",
        data: data
    })
}

export const POST = async (request: Request) => {
    const res = await fetch("http://0.0.0.0:8000/api/v1/habits/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(await request.json())
    })
    
    const data = await res.json()

    return NextResponse.json({
        message: "Habit created successfully",
        data: data
    })

    
}