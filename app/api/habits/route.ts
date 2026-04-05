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
    const usrInp = await request.json()
    console.log(usrInp, "!!POST data!!")

    const siphenedData = {
        id: usrInp.id,
        title: usrInp.title,
        description: usrInp.description || "None",
        frequency: usrInp.frequency,
        duration: usrInp.duration,
        measurement: usrInp.measurement,
        steps: usrInp.steps
    }

    console.log(siphenedData, "!!siphened data!!")

    const res = await fetch("http://0.0.0.0:8000/api/v1/habits/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(siphenedData)
    })

    const data = await res.json()

    return NextResponse.json({
        message: "Habit created successfully",
        data: data
    })
}

export const PUT = async (request: Request) => {
    const usrInp = await request.json()
    console.log(usrInp, "!!PUT data!!")

    const siphenedData = {
        id: usrInp.id,
        title: usrInp.title,
        description: usrInp.description || "None",
        frequency: usrInp.frequency,
        duration: usrInp.duration,
        measurement: usrInp.measurement,
        steps: usrInp.steps.map((step: any) => ({
            id: step.id.toString(),
            title: step.title,
            time: step.time
        }))
    }

    console.log(siphenedData, "!!siphened data!!")
    const res = await fetch("http://0.0.0.0:8000/api/v1/habits/update", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(siphenedData)
    })

    const data = await res.json()

    return NextResponse.json({
        message: "Habit updated successfully",
        data: data
    })
}

export const DELETE = async (request: Request) => {
    const { id } = await request.json()

    console.log(id, "!!DELETE id!!")

    const res = await fetch("http://0.0.0.0:8000/api/v1/habits/delete/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            habit_id: id
        })
    })

    const data = await res.json()

    return NextResponse.json({
        message: "Habit deleted successfully",
        data: data
    })
}