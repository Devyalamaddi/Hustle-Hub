import { Loader2 } from "lucide-react"

export default function VideoMeetingLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-lg">Loading video meeting...</p>
        </div>
      </div>
    </div>
  )
}
