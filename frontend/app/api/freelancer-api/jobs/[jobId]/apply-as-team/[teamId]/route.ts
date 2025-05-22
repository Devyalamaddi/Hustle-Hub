import { type NextRequest, NextResponse } from "next/server"
const BACKEND_URL = process.env.BACKEND_URL || "https://hustle-hub-backend.onrender.com"

// Apply for a job as a team
export async function POST(request: NextRequest, { params }: { params: { jobId: string; teamId: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header is required" }, { status: 401 })
    }

    const body = await request.json()

    const response = await fetch(
      `${BACKEND_URL}/freelancer-api/jobs/${params.jobId}/apply-as-team/${params.teamId}`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error applying for job as team:", error)
    return NextResponse.json({ error: "Failed to apply for job as team" }, { status: 500 })
  }
}
