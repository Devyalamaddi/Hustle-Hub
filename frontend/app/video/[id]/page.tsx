"use client"

import VideoMeeting from "@/components/video/video-meeting"
import { useParams } from "next/navigation"

export default function VideoMeetingPage() {
  const {id} = useParams();
  return <VideoMeeting roomId={id.toString()} />
}
