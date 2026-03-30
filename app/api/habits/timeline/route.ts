import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
    const userInp = await request.json()
    console.log(userInp, "!!userinput data!!")

    // return NextResponse.json({
    //     message: "Habit created successfully",
    //     data: userInp
    // })

    const res = await fetch("http://0.0.0.0:8000/api/v1/daily-tracking/habit-timeline/", {
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