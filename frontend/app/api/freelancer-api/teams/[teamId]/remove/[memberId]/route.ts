import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

// Remove a member from a team
export async function POST(request: NextRequest, { params }: { params: { teamId: string; memberId: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header is required" }, { status: 401 })
    }

    const response = await fetch(
      `${BACKEND_URL}/freelancer-api/teams/${params.teamId}/remove/${params.memberId}`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      },
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error removing team member:", error)
    return NextResponse.json({ error: "Failed to remove team member" }, { status: 500 })
  }
}
