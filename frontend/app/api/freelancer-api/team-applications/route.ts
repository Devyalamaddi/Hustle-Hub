import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "https://hustle-hub-backend.onrender.com"

// Get all team applications for the current user
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header is required" }, { status: 401 })
    }

    const response = await fetch(`${BACKEND_URL}/freelancer-api/team-applications`, {
      headers: {
        Authorization: authHeader,
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error fetching team applications:", error)
    return NextResponse.json({ error: "Failed to fetch team applications" }, { status: 500 })
  }
}
