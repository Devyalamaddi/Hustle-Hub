import VideoMeeting from "@/components/video/video-meeting"

export default function VideoMeetingPage({ params }: { params: { id: string } }) {
  return <VideoMeeting roomId={params.id} />
}
