import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
    const usrInp = await request.json()

    const siphenedData = {
        email: usrInp.email,
        image: usrInp.image,
        name: usrInp.name
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const url = `${backendUrl}/api/v1/user-authorize/with-jwt`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(siphenedData)
    })

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend authorization failed:", res.status, errorText);
        return NextResponse.json(
            { message: "Backend authorization failed", error: errorText },
            { status: res.status }
        );
    }

    const data = await res.json()

    return NextResponse.json({
        message: "User authorized successfully",
        data: data
    })
}