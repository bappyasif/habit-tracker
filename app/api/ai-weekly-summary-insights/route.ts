import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;


export async function POST(request: Request) {
    try {
        const { hobbyName, hobbyDescription, hobbyFeedback } = await request.json();

        if (!hobbyName || !hobbyDescription || !hobbyFeedback) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

        const insights = await fetch(
            `${backendUrl}/api/v1/genai/weekly-summary`,
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
            .then((res) => res.json()).catch((error) => {
                console.error('Error fetching weekly summary insights:', error);
                throw error;
            });

        return NextResponse.json(insights, { status: 200 });
    } catch (error) {
        console.error('Error generating AI insights:', error);
        return NextResponse.json({ error: 'Failed to generate AI insights' }, { status: 500 });
    }
}