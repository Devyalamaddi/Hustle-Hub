"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Meeting {
  _id: string
  title: string
  meetLink: string
  date: string
  time: string
  clientID: {
    name?: string
  }
}

export default function FreelancerMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchMeetings() {
      try {
        const res = await fetch("/api/freelancer-api/meetings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
        if (!res.ok) {
          throw new Error("Failed to fetch meetings")
        }
        const data = await res.json()
        setMeetings(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchMeetings()
  }, [])

  if (loading) {
    return <div>Loading meetings...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Meetings</h1>
      {meetings.length === 0 ? (
        <p>No meetings scheduled.</p>
      ) : (
        <ul className="space-y-4">
          {meetings.map((meeting) => (
            <li key={meeting._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{meeting.title}</h2>
              <p>
                Date: {new Date(meeting.date).toLocaleDateString()} Time: {meeting.time}
              </p>
              <p>Client: {meeting.clientID?.name || "Unknown"}</p>
              <Button
                variant="outline"
                onClick={() => window.open(meeting.meetLink, "_blank")}
                className="mt-2"
              >
                Join Meeting
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
