"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function VideoCallCard() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setRole(parsedUser.role || null);
    }
  }, []);

  const createNewMeeting = () => {
    setIsCreating(true)
    setTimeout(() => router.push(`/${role}/meetings`), 500)
  }

  const goToVideoPage = () => {
    router.push("/video")
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
            <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle>Video Meetings</CardTitle>
        </div>
        <CardDescription>Connect with clients or team members through secure video calls</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Schedule meetings, collaborate on projects, or conduct interviews with our integrated video calling solution.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={createNewMeeting} className="w-full" disabled={isCreating}>
          {isCreating ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              Creating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              New Meeting <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
        <Button variant="outline" onClick={goToVideoPage} className="w-full">
          Join Meeting
        </Button>
      </CardFooter>
    </Card>
  )
}
