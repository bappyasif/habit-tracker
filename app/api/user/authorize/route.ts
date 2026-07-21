import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
    const usrInp = await request.json()

    const siphenedData = {
        email: usrInp.email,
        image: usrInp.image,
        name: usrInp.name
    }

    const url = "http://0.0.0.0:8000/api/v1/user-authorize/with-jwt"
    
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(siphenedData)
    })

    const data = await res.json()

    return NextResponse.json({
        message: "User authorized successfully",
        data: data
    })
}