// export async function POST(request: Request) {
//     // Simulate AI insights generation
//     return new Response(JSON.stringify({
//         weeklySummary: "This week, your engagement with your hobby has been impressive!",
//         suggestions: [
//             "Try dedicating more time to your hobby on weekends.",
//             "Consider joining a local group or community related to your hobby.",
//             "Explore new techniques or tools to enhance your experience with your hobby."
//         ]
//     }))
// }

import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { hobbyName, hobbyDescription, hobbyFeedback } = await request.json();
        
        // console.log(hobbyName, hobbyDescription, hobbyFeedback, "INSIGHTS API CALL WEEKLY")

        if (!hobbyName || !hobbyDescription || !hobbyFeedback) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // const insights = await generateAIInsights(hobbyName, hobbyDescription, hobbyFeedback);

        const insights = await fetch(
            "http://127.0.0.1:8000/api/v1/genai/weekly-summary",
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // prompt: `Generate weekly insights for a hobby with the following details:\n\nHobby Name: ${hobbyName}\nHobby Description: ${hobbyDescription}\nHobby Feedback: ${hobbyFeedback}\n\nProvide a weekly summary and suggestions for improvement.`,
                hobbyName,
                hobbyDescription,
                hobbyFeedback,
            }),
        })
        .then((res) => res.json());

        // console.log(insights, "INSIGHTS WEEKLY")

        return NextResponse.json(insights, { status: 200 });
    } catch (error) {
        console.error('Error generating AI insights:', error);
        return NextResponse.json({ error: 'Failed to generate AI insights' }, { status: 500 });
    }
}