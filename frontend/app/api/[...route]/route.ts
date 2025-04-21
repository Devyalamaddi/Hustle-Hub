import { type NextRequest, NextResponse } from "next/server"

// This is a proxy API route handler that forwards requests to the Express backend
export async function GET(request: NextRequest, { params }: { params: { route: string[] } }) {
  return await handleRequest(request, params.route, "GET")
}

export async function POST(request: NextRequest, { params }: { params: { route: string[] } }) {
  return handleRequest(request, params.route, "POST")
}

export async function PUT(request: NextRequest, { params }: { params: { route: string[] } }) {
  return handleRequest(request, params.route, "PUT")
}

export async function DELETE(request: NextRequest, { params }: { params: { route: string[] } }) {
  return handleRequest(request, params.route, "DELETE")
}

async function handleRequest(request: NextRequest, routeParts: string[], method: string) {
  const routePath = routeParts.join("/")

  // Get the backend URL from environment variables or use default
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080"

  // Forward the request to the Express backend
  const url = `${backendUrl}/${routePath}`

  try {
    // Extract headers from the original request
    const headers: HeadersInit = {}

    // Copy the authorization header if present
    const authHeader = request.headers.get("authorization")
    if (authHeader) {
      headers["Authorization"] = authHeader
    }

    // Set content type for requests with body
    if (method !== "GET" && method !== "HEAD") {
      headers["Content-Type"] = "application/json"
    }

    // Get request body if it's not a GET or HEAD request
    let body = null
    if (method !== "GET" && method !== "HEAD") {
      const contentType = request.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        body = await request.json()
      } else {
        body = await request.text()
      }
    }

    // Forward the request to the backend
    const response = await fetch(url, {
      method,
      headers,
      body: method !== "GET" && method !== "HEAD" ? JSON.stringify(body) : null,
    })

    // Get response data
    const data = await response.json().catch(() => null)

    // Return the response with same status code
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`Error proxying request to ${url}:`, error)
    return NextResponse.json({ error: "Failed to connect to backend server" }, { status: 500 })
  }
}
