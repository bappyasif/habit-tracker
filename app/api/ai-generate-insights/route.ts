// write a post request for next js api endpoint that accepts hobbyName, hobbyDescription, hobbyFeedback in the request body and returns ai generated insights as response
import { NextRequest, NextResponse } from 'next/server';

// Mock function to simulate AI insights generation
async function generateAIInsights(hobbyName: string, hobbyDescription: string, hobbyFeedback: string) {
  // In a real implementation, you would call an AI service here
  return {
    weeklySummary: `This week, your engagement with ${hobbyName} has been impressive!`,
    suggestions: [
      `Try dedicating more time to ${hobbyName} on weekends.`,
      `Consider joining a local group or community related to ${hobbyName}.`,
      `Explore new techniques or tools to enhance your experience with ${hobbyName}.`
    ]
  };
}

export async function POST(request: NextRequest) {
  try {
    const { hobbyName, hobbyDescription, hobbyFeedback } = await request.json();

    if (!hobbyName || !hobbyDescription || !hobbyFeedback) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const insights = await generateAIInsights(hobbyName, hobbyDescription, hobbyFeedback);

    return NextResponse.json(insights, { status: 200 });
    } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json({ error: 'Failed to generate AI insights' }, { status: 500 });
  }
}