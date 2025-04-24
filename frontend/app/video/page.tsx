import JoinRoom from "@/components/video/join-room"
import { Button } from "@/components/ui/button"
import { History } from 'lucide-react'
import Link from "next/link"

export default function VideoPage() {
  return (
    <div className="relative">
      <div className="absolute top-4 right-4">
        <Link href="/video/history">
          <Button variant="outline" size="sm">
            <History className="mr-2 h-4 w-4" />
            Meeting History
          </Button>
        </Link>
      </div>
      <JoinRoom />
    </div>
  )
}
