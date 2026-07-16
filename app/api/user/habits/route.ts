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