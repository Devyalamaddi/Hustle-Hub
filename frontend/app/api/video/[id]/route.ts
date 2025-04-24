import { type NextRequest, NextResponse } from "next/server"

// Daily.co API configuration
const API_KEY = process.env.DAILY_API_KEY || "79b1bf2e82d96ae390061f0f2a744a4a086bce0d37611bab844e0bf5545a68eb"

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
}

// Get room information from Daily.co
async function getRoom(room: string) {
  try {
    const response = await fetch(`https://api.daily.co/v1/rooms/${room}`, {
      method: "GET",
      headers,
    })
    return await response.json()
  } catch (err) {
    console.error("Error getting room:", err)
    return { error: true }
  }
}

// Create a new room on Daily.co
async function createRoom(room: string) {
  try {
    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: room,
        properties: {
          enable_screenshare: true,
          enable_chat: true,
          start_video_off: true,
          start_audio_off: false,
          lang: "en",
        },
      }),
    })
    return await response.json()
  } catch (err) {
    console.error("Error creating room:", err)
    return { error: true }
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const roomId = params.id

  if (!API_KEY) {
    return NextResponse.json({ error: "Daily.co API key is not configured" }, { status: 500 })
  }

  try {
    // Check if room exists
    const room = await getRoom(roomId)

    if (room.error) {
      // Create new room if it doesn't exist
      const newRoom = await createRoom(roomId)
      return NextResponse.json(newRoom)
    } else {
      return NextResponse.json(room)
    }
  } catch (error) {
    console.error("Error handling video call request:", error)
    return NextResponse.json({ error: "Failed to process video call request" }, { status: 500 })
  }
}
