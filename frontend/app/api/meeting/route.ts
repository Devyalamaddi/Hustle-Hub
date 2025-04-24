import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Forward the meeting data to your backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/meetings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log(response,"response from the POST OF MEETINGS")
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error recording meeting data:', error);
    return NextResponse.json(
      { error: 'Failed to record meeting data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    let url = `${process.env.BACKEND_URL}/api/meetings`;
    if (userId) {
      url += `?userId=${userId}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching meeting history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meeting history' },
      { status: 500 }
    );
  }
}
