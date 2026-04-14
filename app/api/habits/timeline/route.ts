import { NextResponse } from "next/server"

export const GET = async (request: Request) => {
    const url = new URL(request.url)
    const habitId = url.searchParams.get('habitId') || "";
    const res = await fetch("http://0.0.0.0:8000/api/v1/daily-tracking/habit-timeline/" + habitId)

    const data = await res.json()

    return NextResponse.json({
        message: "Habits daily timeline route",
        data: data
    })
}

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

export const PUT = async (request: Request) => {
    const usrInp = await request.json()
    // console.log(usrInp, "!!PUT data!!", "http://0.0.0.0.0:8000/api/v1/daily-tracking/habit-timeline/"+usrInp.habitId)

    // const siphenedData = {
    //     habit_id: usrInp.habitId,
    //     date: usrInp.date,
    //     is_completed: usrInp.isCompleted
    // }

    // console.log(siphenedData, "!!siphenedData for PUT!!")

    // return NextResponse.json({
    //     message: "Habit updated successfully",
    //     data: siphenedData
    // })

    if(!usrInp.habitId) {
        return NextResponse.json({
            message: "Habit ID is required for updating the habit timeline"
        })
    }

    // console.log(usrInp, "!!user input for PUT!!")

    const res = await fetch("http://0.0.0.0:8000/api/v1/daily-tracking/habit-timeline/"+usrInp.habitId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usrInp)
    })

    const data = await res.json()

    // console.log(data, "!!response from PUT API call!!")

    return NextResponse.json({
        message: "Habit updated successfully",
        data: data
    })
}