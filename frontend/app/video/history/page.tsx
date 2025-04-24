"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Calendar, Clock, Users, Video } from 'lucide-react'
import { useRouter } from "next/navigation"
import { format } from "date-fns"

interface MeetingRecord {
  _id: string
  meetingId: string
  roomId: string
  title?: string
  startTime: string
  endTime?: string
  participants: {
    userId: string
    userRole: string
    joinTime: string
    leaveTime?: string
  }[]
}

export default function MeetingHistory() {
  const [meetings, setMeetings] = useState<MeetingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchMeetingHistory = async () => {
      try {
        // Get user ID from localStorage
        const userString = localStorage.getItem('user')
        if (!userString) {
          setError("User information not found. Please log in.")
          setLoading(false)
          return
        }
        
        const user = JSON.parse(userString)
        const userId = user?.id
        
        if (!userId) {
          setError("User ID not found. Please log in.")
          setLoading(false)
          return
        }
        
        const response = await fetch(`/api/meetings?userId=${userId}`)
        
        if (!response.ok) {
          throw new Error(`Error fetching meeting history: ${response.status}`)
        }
        
        const data = await response.json()
        setMeetings(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching meeting history:", err)
        setError("Failed to load meeting history. Please try again.")
        setLoading(false)
      }
    }
    
    fetchMeetingHistory()
  }, [])

  const joinMeeting = (roomId: string) => {
    router.push(`/video/${roomId}`)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (err) {
      return "Unknown date"
    }
  }

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a")
    } catch (err) {
      return "Unknown time"
    }
  }

  const formatDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return "Ongoing"
    
    try {
      const start = new Date(startTime).getTime()
      const end = new Date(endTime).getTime()
      const durationMs = end - start
      
      const minutes = Math.floor(durationMs / 60000)
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      
      if (hours > 0) {
        return `${hours}h ${remainingMinutes}m`
      } else {
        return `${minutes}m`
      }
    } catch (err) {
      return "Unknown duration"
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Meeting History</h1>
          <p className="text-muted-foreground mt-2">View your past and ongoing meetings</p>
        </div>
        <Button 
          onClick={() => router.push('/video')}
          className="mt-4 md:mt-0"
        >
          <Video className="mr-2 h-4 w-4" />
          New Meeting
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2">Loading meeting history...</span>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 dark:text-red-400 text-2xl">!</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Error</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button 
                className="mt-4" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : meetings.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">No meetings found</h3>
              <p className="text-muted-foreground">You haven't participated in any meetings yet.</p>
              <Button 
                className="mt-4" 
                onClick={() => router.push('/video')}
              >
                Start a Meeting
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {meetings.map((meeting) => (
            <Card key={meeting._id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 flex items-center justify-center md:w-24">
                    <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {meeting.title || `Meeting: ${meeting.roomId}`}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            {formatDate(meeting.startTime)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            {formatTime(meeting.startTime)}
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            {meeting.participants.length} participants
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          Duration: {formatDuration(meeting.startTime, meeting.endTime)}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Button 
                          onClick={() => joinMeeting(meeting.roomId)}
                          variant={meeting.endTime ? "outline" : "default"}
                        >
                          {meeting.endTime ? "Rejoin Meeting" : "Join Ongoing Meeting"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
