"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Copy, CheckCircle } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

interface VideoMeetingProps {
  roomId: string | null
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any
  }
}

export default function VideoMeeting({ roomId }: VideoMeetingProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const jitsiApiRef = useRef<any>(null)
  const { toast } = useToast()

  // Get user info from localStorage
  const getUserInfo = () => {
    try {
      const userString = localStorage.getItem('user')
      const roleString = localStorage.getItem('role')
      
      const user = userString ? JSON.parse(userString) : null
      const role = roleString ? roleString : null
      
      return {
        userId: user?.id || 'anonymous',
        displayName: user?.name || 'Guest',
        email: user?.email || '',
        role: role || 'guest'
      }
    } catch (err) {
      console.error("Error parsing user data from localStorage:", err)
      return {
        userId: 'anonymous',
        displayName: 'Guest',
        email: '',
        role: 'guest'
      }
    }
  }

  useEffect(() => {
    // Load the Jitsi Meet API script
    const loadJitsiScript = () => {
      return new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector("script[src='https://meet.jit.si/external_api.js']")
        if (existingScript) {
          resolve()
          return
        }
        
        const script = document.createElement("script")
        script.src = "https://meet.jit.si/external_api.js"
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error("Failed to load Jitsi Meet API"))
        document.body.appendChild(script)
      })
    }

    const initJitsi = async () => {
      try {
        await loadJitsiScript()
        
        // Wait a bit to ensure the API is fully loaded
        setTimeout(() => {
          if (!jitsiContainerRef.current || !window.JitsiMeetExternalAPI) {
            setError("Failed to initialize video call. Please refresh the page.")
            setLoading(false)
            return
          }
          
          const userInfo = getUserInfo()
          
          // Initialize Jitsi Meet API
          const domain = "meet.jit.si"
          const options = {
            roomName: `hustlehub-${roomId}`,
            width: "100%",
            height: "100%",
            parentNode: jitsiContainerRef.current,
            userInfo: {
              displayName: userInfo.displayName,
              email: userInfo.email
            },
            configOverwrite: {
              prejoinPageEnabled: false,
              startWithAudioMuted: true,
              startWithVideoMuted: false,
              disableDeepLinking: true
            },
            interfaceConfigOverwrite: {
              TOOLBAR_BUTTONS: [
                "microphone", "camera", "desktop", "fullscreen",
                "hangup", "profile", "chat", "recording",
                "settings", "raisehand", "videoquality",
                "filmstrip", "invite", "tileview"
              ],
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              DEFAULT_BACKGROUND: "#3c3c3c",
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
            }
          }
          
          try {
            jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options)
            
            // Add event listeners
            jitsiApiRef.current.addEventListeners({
              videoConferenceJoined: () => {
                setLoading(false)
                
                // Record meeting start
                fetch('/api/meetings', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    roomId: roomId,
                    meetingId: `hustlehub-${roomId}`,
                    userId: userInfo.userId,
                    userRole: userInfo.role,
                    action: 'joined',
                    timestamp: new Date().toISOString()
                  })
                }).catch(err => console.error("Error recording meeting join:", err))
                
                toast({
                  title: "Meeting joined",
                  description: "You've successfully joined the meeting"
                })
              },
              videoConferenceLeft: () => {
                // Record meeting end
                const userInfo = getUserInfo()
                fetch('/api/meetings', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    roomId: roomId,
                    meetingId: `hustlehub-${roomId}`,
                    userId: userInfo.userId,
                    userRole: userInfo.role,
                    action: 'left',
                    timestamp: new Date().toISOString()
                  })
                }).catch(err => console.error("Error recording meeting leave:", err))
                
                toast({
                  title: "Meeting left",
                  description: "You've left the meeting"
                })
              },
              participantJoined: (participant: any) => {
              },
              participantLeft: (participant: any) => {
              }
            })
          } catch (err) {
            console.error("Error creating Jitsi instance:", err)
            setError("Failed to create meeting. Please try again.")
            setLoading(false)
          }
        }, 1000) // Give a second for the API to fully load
      } catch (err) {
        console.error("Error initializing Jitsi:", err)
        setError("Failed to initialize video call. Please try again.")
        setLoading(false)
      }
    }
  
    initJitsi()
  
    return () => {
      if (jitsiApiRef.current) {
        // Record meeting end on component unmount
        const userInfo = getUserInfo()
        fetch('/api/meetings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomId: roomId,
            meetingId: `hustlehub-${roomId}`,
            userId: userInfo.userId,
            userRole: userInfo.role,
            action: 'left',
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.error("Error recording meeting leave on unmount:", err))
        
        jitsiApiRef.current.dispose()
      }
    }
  }, [roomId, toast])

  const copyMeetingLink = () => {
    const link = `${window.location.origin}/video/${roomId}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    toast({
      title: "Link copied!",
      description: "Meeting link copied to clipboard"
    })
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Meeting: {roomId}</h1>
              <p className="text-muted-foreground">Share this link with others to join the meeting</p>
            </div>
            <Button onClick={copyMeetingLink} variant="outline" className="min-w-[140px]">
              {copied ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="video-container relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-800" style={{ height: '600px' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-10">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
              <p className="mt-4 text-lg">Initializing video call...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-10">
            <div className="text-center max-w-md p-6">
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 dark:text-red-400 text-2xl">!</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Error</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Jitsi will be inserted here */}
        <div ref={jitsiContainerRef} className="w-full h-full"></div>
      </div>
    </div>
  )
}
