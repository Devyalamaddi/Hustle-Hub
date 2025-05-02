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
  clientID: {
    _id: string
    name?: string
    companyName?: string
    industry?: string
    contactInfo?: string
    email?: string
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
  title: "",
  meetLink: "",
  date: "",
  time: "",
  clientID: { _id: "", name: "" },
}

export default function FreelancerMeetingsPage() {
  let { user } = useAuth()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [formVisible, setFormVisible] = useState(false)
  const [formData, setFormData] = useState<Partial<Meeting>>(emptyMeeting)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [clients, setClients] = useState<any[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>("")

  const token = localStorage.getItem("token")


  useEffect(() => {
    fetchMeetings()
    fetchClients()
  }, [user])

  async function fetchMeetings() {
    setLoading(true)
    try {
      const res = await fetch("/api/freelancer-api/meetings", {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
         },
      })
      if (!res.ok) throw new Error("Failed to fetch meetings")
      const data = await res.json()
      setMeetings(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchClients() {
    try {
      if (!user) {
        user = JSON.parse(localStorage.getItem("user") || "{}")
      }
      const freelancerID = user?.id
      const res = await fetch(`/api/freelancer-api/freelancers/${freelancerID}/clients`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
      // console.log(await res.json())
      if (!res.ok) throw new Error("Failed to fetch clients")
      const data = await res.json()
      setClients(data)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  function openForm(meeting?: Meeting) {
    if (meeting) {
      setFormData(meeting)
      setEditingId(meeting._id)
      setSelectedClientId(meeting.clientID?._id || "")
    } else {
      setFormData(emptyMeeting)
      setEditingId(null)
      setSelectedClientId("")
    }
    setFormVisible(true)
    setError(null)
  }

  function closeForm() {
    setFormVisible(false)
    setFormData(emptyMeeting)
    setEditingId(null)
    setSelectedClientId("")
    setError(null)
  }

  function parseJobsString(input: string): Job[] {
    try {
      const jsonStr = input
        .replace(/new ObjectId\('([a-fA-F0-9]+)'\)/g, '"$1"') // remove ObjectId
        .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // quote keys
        .replace(/'/g, '"'); // replace single quotes
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Job string parsing failed", e);
      return [];
    }
  }
  

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const { title, meetLink, date, time } = formData
    if (!title || !meetLink || !date || !time || !selectedClientId) {
      setError("Please fill in all required fields and select a client")
      return
    }

    try {
      const url = editingId
        ? `/api/freelancer-api/meetings/${editingId}`
        : "/api/freelancer-api/meetings"
      const method = editingId ? "PUT" : "POST"

      const bodyData = {
        ...formData,
        clientID: selectedClientId,
        freelancerID: user?.id,
      }

      

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      const res = await fetch(`/api/freelancer-api/meetings/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to delete meeting")
      await fetchMeetings()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const selectedClient = clients.find(client => client._id === selectedClientId)

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
            <div className="mb-2">
              <label className="block font-semibold mb-1" htmlFor="client">
                Client *
              </label>
              <select
                id="client"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name} ({client.companyName})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4 mt-4">
              <Button type="submit">{editingId ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
            </div>
          </form>
          {selectedClient && (
            <div className="flex-1 border p-4 rounded shadow max-w-md">
              <h2 className="text-xl font-semibold mb-4">Client Details</h2>
              <p><strong>Name:</strong> {selectedClient.name}</p>
              <p><strong>Company:</strong> {selectedClient.companyName}</p>
              <p><strong>Industry:</strong> {selectedClient.industry}</p>
              <p><strong>Contact Info:</strong> {selectedClient.contactInfo}</p>
              <p><strong>Email:</strong> {selectedClient.email}</p>
              <h3 className="text-lg font-semibold mt-4 mb-2">Jobs</h3>
              {(!selectedClient.jobs || selectedClient.jobs.length === 0) ? (
                <p>No jobs found for this client.</p>
              ) : (
                <ul className="list-disc list-inside">
                  {(() => {
                    let jobsArray: Job[] = [];

                    if (typeof selectedClient.jobs === "string") {
                      jobsArray = parseJobsString(selectedClient.jobs);
                    } else {
                      jobsArray = selectedClient.jobs || [];
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
