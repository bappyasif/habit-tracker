// write a post request for next js api endpoint that accepts hobbyName, hobbyDescription, hobbyFeedback in the request body and returns ai generated insights as response
import { NextRequest, NextResponse } from 'next/server';

const getBackendUrl = () => {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
  return backendUrl;
}

export async function POST(request: NextRequest) {
  try {
    const { hobbyName, hobbyDescription, hobbyFeedback } = await request.json();

    if (!hobbyName || !hobbyDescription || !hobbyFeedback) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const insights = await fetch(`${getBackendUrl()}/api/v1/genai/inference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hobby: hobbyName,
        description: hobbyDescription,
        feedback: hobbyFeedback,
      }),
    }).then((res) => res.json());

    return NextResponse.json(insights, { status: 200 });
    } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json({ error: 'Failed to generate AI insights' }, { status: 500 });
  }
}