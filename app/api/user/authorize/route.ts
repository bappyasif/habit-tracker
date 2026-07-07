import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
    const usrInp = await request.json()

    const siphenedData = {
        email: usrInp.email,
        image: usrInp.image,
        name: usrInp.name
    }

    console.log(usrInp, "User authorization request:", siphenedData)

    const url = "http://0.0.0.0:8000/api/v1/user-authorize"
    
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(siphenedData)
    })

    const data = await res.json()

    console.log("User authorization response:", data)

    return NextResponse.json({
        message: "User authorized successfully",
        data: data
    })
}