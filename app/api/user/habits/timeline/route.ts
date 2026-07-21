import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    const url = new URL(request.url)
    const habitId = url.searchParams.get('habitId') || "";

    if(!habitId) {
        return NextResponse.json({
            message: "Habit ID is required"
        })
    }
    
    const token = request.headers.get("authorization")
    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    const authToken = token.replace(/"/g, '');
    const apiUrl = `http://0.0.0.0:8000/api/v1/user-habit-daily-tracking/timeline/${habitId}`

    // const res = await fetch("http://0.0.0.0:8000/api/v1/daily-tracking/habit-timeline/" + habitId)
    const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authToken
        }
    })

    const data = await res.json()

    return NextResponse.json({
        message: "Habits daily timeline route",
        data: data
    })
}

export const POST = async (request: Request) => {
    const token = request.headers.get("authorization")
    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    const authToken = token.replace(/"/g, '');

    const userInp = await request.json()

    const res = await fetch("http://0.0.0.0:8000/api/v1/user-habit-daily-tracking/timeline/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authToken
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
    const token = request.headers.get("authorization")
    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    const usrInp = await request.json()

    if(!usrInp.habitId) {
        return NextResponse.json({
            message: "Habit ID is required for updating the habit timeline"
        })
    }

    const authToken = token.replace(/"/g, '');

    const res = await fetch("http://0.0.0.0:8000/api/v1/user-habit-daily-tracking/timeline/"+usrInp.habitId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authToken
        },
        body: JSON.stringify(usrInp)
    })

    const data = await res.json()

    return NextResponse.json({
        message: "Habit updated successfully",
        data: data
    })
}