"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Users, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function JoinRoom() {
  const [room, setRoom] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onSubmit = () => {
    if (!room.trim()) return

    setIsLoading(true)
    router.push(`/video/${room}`)
  }

  const generateRandomRoom = () => {
    const randomId = Math.random().toString(36).substring(2, 9)
    setRoom(randomId)
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Video className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Join Video Meeting</CardTitle>
            <CardDescription>Enter a room code or create a new meeting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="room" className="text-sm font-medium">
                Room Code
              </label>
              <Input
                id="room"
                placeholder="Enter room code"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button onClick={onSubmit} className="w-full" disabled={!room.trim() || isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Joining...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Join Meeting <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
            <Button variant="outline" onClick={generateRandomRoom} className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Create New Meeting
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
