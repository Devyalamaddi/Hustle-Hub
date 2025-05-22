import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "https://hustle-hub-backend.onrender.com"

// Reject a team invitation
export async function POST(request: NextRequest, { params }: { params: { teamId: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header is required" }, { status: 401 })
    }

    const response = await fetch(`${BACKEND_URL}/freelancer-api/teams/${params.teamId}/reject-invitation`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error rejecting team invitation:", error)
    return NextResponse.json({ error: "Failed to reject team invitation" }, { status: 500 })
  }
}
