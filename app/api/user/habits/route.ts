import { NextResponse } from "next/server"

const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

export const GET = async (request: Request) => {
    const token = request.headers.get("authorization")

    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    // Clean the header string to remove any escaped or accidental double quotes
    const authHeader = token.replace(/"/g, '');

    const url = `${backendUrl}/api/v1/user-habits/secured`

    const res = await fetch(url, {
        headers: {
            "Authorization": authHeader,
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()

    return NextResponse.json({
        message: "User habits route is successfully fetched",
        data: data
    })
}

export const POST = async (request: Request) => {
    const usrInp = await request.json()

    if (!usrInp.userId) {
        return NextResponse.json({
            message: "User ID is required"
        })
    }

    const siphenedData = {
        id: usrInp.id,
        title: usrInp.title,
        description: usrInp.description || "None",
        frequency: usrInp.frequency,
        duration: usrInp.duration,
        measurement: usrInp.measurement,
        steps: usrInp.steps,
        userId: usrInp.userId
    }

    const bearerToken = request.headers.get("authorization")

    if (!bearerToken) {
        return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    const authToken = bearerToken.replace(/"/g, '');

    const res = await fetch(`${backendUrl}/api/v1/user-habits/create-securely`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authToken
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
    const userInp = await request.json()

    if (!userInp.userId) {
        return NextResponse.json({
            message: "User ID is required"
        })
    }

    const siphenedData = {
        id: userInp.id.toString(),
        userId: userInp.userId,
        title: userInp.title,
        description: userInp.description || "None",
        frequency: userInp.frequency,
        duration: userInp.duration,
        measurement: userInp.measurement,
        steps: userInp.steps.map((step: any) => ({
            id: step.id.toString(),
            // id: step.id,
            title: step.title,
            time: step.time
        }))
    }

    const bearerToken = request.headers.get("authorization")

    if (!bearerToken) {
        return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    const authToken = bearerToken.replace(/"/g, '');

    const url = `${backendUrl}/api/v1/user-habits/update-securely`

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authToken
        },
        body: JSON.stringify(siphenedData)
    })

    if (!res.ok) {
        const details = await res.text()
        return NextResponse.json(
            { error: "Backend request failed", details },
            { status: res.status }
        )
    }

    const data = await res.json()

    return NextResponse.json({
        message: "Habit updated successfully",
        data: data
    })
}

export const DELETE = async (request: Request) => {
    const { id } = await request.json()

    if (!id) {
        return NextResponse.json({
            message: "Habit ID is required"
        })
    }

    const bearerToken = request.headers.get("authorization")

    if (!bearerToken) {
        return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    const authToken = bearerToken.replace(/"/g, '');

    const url = `${backendUrl}/api/v1/user-habits/delete-securely/${id}`

    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authToken
        }
    })

    const data = await res.json()

    return NextResponse.json({
        message: "Habit deleted successfully",
        data: data
    })
}