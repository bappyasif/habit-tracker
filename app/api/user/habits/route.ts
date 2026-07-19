import { NextResponse } from "next/server"

export const GET = async (request: Request) => {
    // as we are no longer includig user id in the url so no longer need to get user id from url
    // const url_version = new URL(request.url)
    // const userId = url_version.searchParams.get('userId')

    // const token = url_version.searchParams.get('token')
    const token = request.headers.get("authorization")
    // const userId = request.headers.get("userId")
    // console.log(userId, "!!userId!!")
    console.log(token, "!!token!!")

    // if(!userId) {
    //     return NextResponse.json({
    //         message: "User ID is required"
    //     })
    // }

    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    // Clean the header string to remove any escaped or accidental double quotes
    const authHeader = token.replace(/"/g, '');

    // const url = `http://0.0.0.0:8000/api/v1/user/${userId}/habits`
    
    // const url = `http://0.0.0.0:8000/api/v1/user/habits/${userId}`
    // const url = `http://0.0.0.0:8000/api/v1/user-habits/${userId}`
    const url = `http://0.0.0.0:8000/api/v1/user-habits/secured`

    // const res = await fetch(url)
    const res = await fetch(url, {
        headers: {
            // "Authorization": `Bearer ${token}`,
            "Authorization": authHeader,
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()

    return NextResponse.json({
        message: "User habits route is successfully fetched",
        data: data
    })
    // return NextResponse.json(data, { status: res.status, statusText: res.statusText });
}

export const POST = async (request: Request) => {
    const usrInp = await request.json()

    if(!usrInp.userId) {
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
    console.log(bearerToken, "!!bearerToken!!")

    if (!bearerToken) {
        return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    const authToken = bearerToken.replace(/"/g, '');

    const res = await fetch("http://0.0.0.0:8000/api/v1/user-habits/create-securely", {
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

    if(!userInp.userId) {
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
            title: step.title,
            time: step.time
        }))
    }

    // console.log(siphenedData, "!!siphenedData!!update habit route")

    const bearerToken = request.headers.get("authorization")
    // console.log(bearerToken, "!!bearerToken!! update route")

    if (!bearerToken) {
        return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    const authToken = bearerToken.replace(/"/g, '');

    const url = `http://0.0.0.0:8000/api/v1/user-habits/update-securely`

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authToken
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

    if (!id) {
        return NextResponse.json({
            message: "Habit ID is required"
        })
    }

    const bearerToken = request.headers.get("authorization")
    // console.log(bearerToken, "!!bearerToken!!")

    if (!bearerToken) {
        return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    const authToken = bearerToken.replace(/"/g, '');

    const url = `http://0.0.0.0:8000/api/v1/user-habits/delete-securely/${id}`

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