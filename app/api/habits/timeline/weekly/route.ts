import { NextRequest, NextResponse } from "next/server"

const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

export const GET = async (req: NextRequest) => {
    // const { id } = await req.json()
    const id = req.nextUrl.searchParams.get('id')
    console.log(id, "!!id!!")

    const res = await fetch(`${backendUrl}/api/v1/weekly-timeline/habit-timeline/` + id)
    const data = await res.json()
    console.log(data, "!!data!!")

    return NextResponse.json({
        message: "Habits route",
        data: data
    })
}

export const POST = async (request: Request) => {
    const userInp = await request.json()
    console.log(userInp, "!!userinput data!!")

    const res = await fetch(`${backendUrl}/api/v1/weekly-timeline/habit-timeline/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInp)
    })

    const data = await res.json()

    if (data.error) {
        return NextResponse.json({
            message: data.error
        })
    }


    return NextResponse.json({
        message: "Habit created successfully",
        data: data
    })
}