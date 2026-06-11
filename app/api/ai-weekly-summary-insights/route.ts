import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { hobbyName, hobbyDescription, hobbyFeedback } = await request.json();

        if (!hobbyName || !hobbyDescription || !hobbyFeedback) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const insights = await fetch(
            "http://127.0.0.1:8000/api/v1/genai/weekly-summary",
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                hobbyName,
                hobbyDescription,
                hobbyFeedback,
            }),
        })
        .then((res) => res.json());

        return NextResponse.json(insights, { status: 200 });
    } catch (error) {
        console.error('Error generating AI insights:', error);
        return NextResponse.json({ error: 'Failed to generate AI insights' }, { status: 500 });
    }
}