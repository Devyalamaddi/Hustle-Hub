"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "../../../context/auth-context"

interface Meeting {
  _id: string
  title: string
  meetLink: string
  date: string
  time: string
  freelancerID: {
    _id: string
    name?: string
    email?: string
    skills?: string[]
    jobs?: Job[]
  }
}

interface Job {
  _id: string
  title: string
  description?: string
  budget?: number
  status?: string
}

const emptyMeeting = {
  _id: "",
  title: "",
  meetLink: "",
  date: "",
  time: "",
  freelancerID: { _id: "", name: "" },
}

export default function ClientMeetingsPage() {
  let { user } = useAuth()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [formVisible, setFormVisible] = useState(false)
  const [formData, setFormData] = useState<Partial<Meeting>>(emptyMeeting)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [freelancers, setFreelancers] = useState<any[]>([])
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string>("")
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchMeetings()
    fetchFreelancers()
  }, [user])

  async function fetchMeetings() {
    setLoading(true)
    try {
      const res = await fetch("/api/client-api/meetings", {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
         },
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch meetings")
      const data = await res.json()
    // console.log(data,"fetchMeetings")
      setMeetings(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchFreelancers() {
    try {
      if (!user) {
        user = JSON.parse(localStorage.getItem("user")|| "{}")
      }
      const res = await fetch(`/api/client-api/${user?.id}/freelancers`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
         },
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch freelancers")
      const data = await res.json()
      setFreelancers(data)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  function openForm(meeting?: Meeting) {
    if (meeting) {
      setFormData(meeting)
      setEditingId(meeting._id)
      setSelectedFreelancerId(meeting.freelancerID?._id || "")
    } else {
      setFormData(emptyMeeting)
      setEditingId(null)
      setSelectedFreelancerId("")
    }
    setFormVisible(true)
    setError(null)
  }

  function closeForm() {
    setFormVisible(false)
    setFormData(emptyMeeting)
    setEditingId(null)
    setSelectedFreelancerId("")
    setError(null)
  }

  const createMeet = () =>{
    // Open the Google Meet landing page in a new tab
    window.open("https://calendar.google.com/calendar/u/0/r/eventedit?vcon=meet&dates=now&hl=en&pli=1", "_blank", "noopener,noreferrer")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const { title, meetLink, date, time } = formData
    if (!title || !meetLink || !date || !time || !selectedFreelancerId) {
      setError("Please fill in all required fields and select a freelancer")
      return
    }

    try {
      const url = editingId
        ? `/api/client-api/meetings/${editingId}`
        : "/api/client-api/meetings"
      const method = editingId ? "PUT" : "POST"

      const bodyData = {
        ...formData,
        freelancerID: selectedFreelancerId,
        clientID: user?.id,
      }

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
         },
        credentials: "include",
        body: JSON.stringify(bodyData),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || "Failed to save meeting")
      }

      await fetchMeetings()
      closeForm()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this meeting?")) return
    try {
      const res = await fetch(`http://localhost:8080/client-api/meetings/${id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
         },
      })
      if (!res.ok) throw new Error("Failed to delete meeting")
      await fetchMeetings()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const selectedFreelancer = freelancers.find(f => f._id === selectedFreelancerId)

  if (loading) return <div>Loading meetings...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Meetings</h1>
      <Button onClick={() => openForm()} className="mb-4">
        + New Meeting
      </Button>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {formVisible && (
        <div className="flex space-x-6">
          <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded shadow max-w-md flex-1">
          <div className="mb-2">
              <label className="block font-semibold mb-1" htmlFor="freelancer">
                Freelancer *
              </label>
              <select
                id="freelancer"
                value={selectedFreelancerId}
                onChange={(e) => setSelectedFreelancerId(e.target.value)}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select a freelancer</option>
                {freelancers.map((freelancer) => (
                  <option key={freelancer._id} value={freelancer._id}>
                    {freelancer.name} ({freelancer.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block font-semibold mb-1" htmlFor="title">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block font-semibold mb-1" htmlFor="meetLink">
                Meeting Link *
              </label>
              <input
                id="meetLink"
                type="url"
                value={formData.meetLink || ""}
                onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
                className="w-full border rounded p-2"
                required
              />
              <Button onClick={createMeet}>
                Get the link
              </Button>
            </div>
            <div className="mb-2">
              <label className="block font-semibold mb-1" htmlFor="date">
                Date *
              </label>
              <input
                id="date"
                type="date"
                value={formData.date ? formData.date.slice(0, 10) : ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block font-semibold mb-1" htmlFor="time">
                Time *
              </label>
              <input
                id="time"
                type="time"
                value={formData.time || ""}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full border rounded p-2"
                required
              />
            </div>
            
            <div className="flex space-x-4 mt-4">
              <Button type="submit">{editingId ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
            </div>
          </form>
          {selectedFreelancer && (
            <div className="flex-1 border p-4 rounded shadow max-w-md">
              <h2 className="text-xl font-semibold mb-4">Freelancer Details</h2>
              <p><strong>Name:</strong> {selectedFreelancer.name}</p>
              <p><strong>Email:</strong> {selectedFreelancer.email}</p>
              <h3 className="text-lg font-semibold mt-4 mb-2">Jobs</h3>
              {(!selectedFreelancer.jobs || selectedFreelancer.jobs.length === 0) ? (
                <p>No jobs found for this freelancer.</p>
              ) : (
                <ul className="list-disc list-inside">
                  {(() => {
                    let jobsArray: Job[] = [];
                    try {
                      if (typeof selectedFreelancer.jobs === "string") {
                        const jsonStr = selectedFreelancer.jobs
                          .replace(/new ObjectId\('([a-f0-9]+)'\)/g, '"$1"')
                          .replace(/'/g, '"')
                          .replace(/(\w+):/g, '"$1":');
                        jobsArray = JSON.parse(jsonStr);
                      } else {
                        jobsArray = selectedFreelancer.jobs;
                      }
                    } catch (e) {
                      console.error("Failed to parse jobs string", e);
                      jobsArray = [];
                    }
                    return jobsArray.map((job: Job) => (
                      <li key={job._id}>
                        <strong>{job.title}</strong> - {job.status} - Budget: ${job.budget}
                      </li>
                    ));
                  })()}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
      {meetings?.length === 0 ? (
        <p>No meetings scheduled.</p>
      ) : (
        <ul className="space-y-4">
          {meetings?.map((meeting) => (
            <li key={meeting._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{meeting.title}</h2>
              <p>
                Date: {new Date(meeting.date).toLocaleDateString()} Time: {meeting.time}
              </p>
              <p>Freelancer: {meeting.freelancerID?.name || "Unknown"}</p>
              <div className="flex space-x-2 mt-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(meeting.meetLink, "_blank")}
                >
                  Join Meeting
                </Button>
                <Button variant="secondary" onClick={() => openForm(meeting)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(meeting._id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
