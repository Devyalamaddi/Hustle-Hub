import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "https://hustle-hub-backend.onrender.com"

// Withdraw a team application
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header is required" }, { status: 401 })
    }

    const response = await fetch(`${BACKEND_URL}/freelancer-api/team-applications/${params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error withdrawing team application:", error)
    return NextResponse.json({ error: "Failed to withdraw team application" }, { status: 500 })
  }
}
