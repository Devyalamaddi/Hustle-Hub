"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "../../../context/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, User, LinkIcon, ExternalLink, Building, Briefcase, Mail, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Meeting {
  _id: string
  title: string
  clientMeetLink: string
  freelancerMeetLink: string
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
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem("token"))
  }, [])

  // New states
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)

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
      if (!res.ok) throw new Error("")
      const data = await res.json()
      setMeetings(data)
      console.log(data);
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

  const createMeet = () => {
    setLinkDialogOpen(true)
  }

  function parseJobsString(input: string): Job[] {
    try {
      const jsonStr = input
        .replace(/new ObjectId$$'([a-fA-F0-9]+)'$$/g, '"$1"') // remove ObjectId
        .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // quote keys
        .replace(/'/g, '"') // replace single quotes
      return JSON.parse(jsonStr)
    } catch (e) {
      console.error("Job string parsing failed", e)
      return []
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const { title, clientMeetLink, freelancerMeetLink, date, time } = formData
    if (!title || !clientMeetLink || !freelancerMeetLink || !date || !time || !selectedClientId) {
      setError("Please fill in all required fields and select a client")
      return
    }

    try {
      const url = editingId ? `/api/freelancer-api/meetings/${editingId}` : "/api/freelancer-api/meetings"
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
      const res = await fetch(`https://hustle-hub-backend.onrender.com/freelancer-api/meetings/${id}`, {
        method: "DELETE",
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })
      if (!res.ok) throw new Error("Failed to delete meeting")
      await fetchMeetings()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const selectedClient = clients.find((client) => client._id === selectedClientId)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Meetings</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="view-mode">Card View</Label>
            <Switch
              id="view-mode"
              checked={viewMode === "cards"}
              onCheckedChange={(checked) => setViewMode(checked ? "cards" : "table")}
            />
          </div>
          <Button onClick={() => openForm()} className="flex items-center gap-2">
            <span>+ New Meeting</span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Meeting Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get Meeting Links</DialogTitle>
            <DialogDescription>Choose where to get your meeting links from.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">Instructions:</h3>
              <p className="text-sm text-muted-foreground">
                As a freelancer, place the host link in the "Freelancer Meeting Link" field and the attendee link in the
                "Client Meeting Link" field.
              </p>
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    window.open("https://515bf00eade21d6f138c.vercel.app/create", "_blank", "noopener,noreferrer")
                    setLinkDialogOpen(false)
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Use Built-in Video Chat
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    window.open("https://meet.google.com/new", "_blank", "noopener,noreferrer")
                    setLinkDialogOpen(false)
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Use Google Meet
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: If using Google Meet, place the same link in both the Freelancer and Client Meeting Link fields.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {formVisible && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Meeting" : "Create New Meeting"}</CardTitle>
              <CardDescription>
                Fill in the details to {editingId ? "update your" : "schedule a new"} meeting
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="freelancerMeetLink">Freelancer Meeting Link *</Label>
                  <div className="flex gap-2">
                    <input
                      id="freelancerMeetLink"
                      type="url"
                      value={formData.freelancerMeetLink || ""}
                      onChange={(e) => setFormData({ ...formData, freelancerMeetLink: e.target.value })}
                      className="w-full border rounded p-2"
                      required
                      placeholder="https://meet.example.com/..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientMeetLink">Client Meeting Link *</Label>
                  <input
                    id="clientMeetLink"
                    type="url"
                    value={formData.clientMeetLink || ""}
                    onChange={(e) => setFormData({ ...formData, clientMeetLink: e.target.value })}
                    className="w-full border rounded p-2"
                    required
                    placeholder="https://meet.example.com/..."
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={createMeet} className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Get Link
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <input
                      id="date"
                      type="date"
                      value={formData.date ? formData.date.slice(0, 10) : ""}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <input
                      id="time"
                      type="time"
                      value={formData.time || ""}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? "Update Meeting" : "Create Meeting"}</Button>
              </CardFooter>
            </form>
          </Card>

          {selectedClient && (
            <Card>
              <CardHeader>
                <CardTitle>Client Details</CardTitle>
                <CardDescription>Information about the selected client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Name:</span> {selectedClient.name}
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Company:</span> {selectedClient.companyName}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Industry:</span> {selectedClient.industry}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Contact:</span> {selectedClient.contactInfo}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Email:</span> {selectedClient.email}
                </div>

                <Separator className="my-2" />

                <div>
                  <h3 className="text-lg font-semibold mb-2">Jobs</h3>
                  {!selectedClient.jobs || selectedClient.jobs.length === 0 ? (
                    <p className="text-muted-foreground">No jobs found for this client.</p>
                  ) : (
                    <ul className="space-y-2">
                      {(() => {
                        let jobsArray: Job[] = []

                        if (typeof selectedClient.jobs === "string") {
                          jobsArray = parseJobsString(selectedClient.jobs)
                        } else {
                          jobsArray = selectedClient.jobs || []
                        }

                        return jobsArray.map((job: Job) => (
                          <li key={job._id} className="p-2 border rounded-md">
                            <div className="font-medium">{job.title}</div>
                            <div className="flex justify-between items-center mt-1">
                              <Badge variant={job.status === "Completed" ? "default" : "outline"}>{job.status}</Badge>
                              <span className="text-sm">Budget: ${job.budget}</span>
                            </div>
                          </li>
                        ))
                      })()}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {meetings.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <h3 className="text-xl font-medium mb-2">No meetings scheduled</h3>
          <p className="text-muted-foreground mb-4">Create your first meeting to get started</p>
          <Button onClick={() => openForm()}>Schedule a Meeting</Button>
        </div>
      ) : (
        <div>
          {viewMode === "table" ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetings?.map((meeting) => (
                    <TableRow key={meeting._id}>
                      <TableCell className="font-medium">{meeting.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(meeting.date)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {meeting.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{meeting.clientID?.name || "Unknown"}</div>
                        <div className="text-sm text-muted-foreground">{meeting.clientID?.companyName}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(meeting.freelancerMeetLink, "_blank")}
                          >
                            Join
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => openForm(meeting)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(meeting._id)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {meetings?.map((meeting) => (
                <Card key={meeting._id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle>{meeting.title}</CardTitle>
                    <CardDescription>
                      With {meeting.clientID?.name || "Unknown"} • {meeting.clientID?.companyName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(meeting.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{meeting.time}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(meeting.freelancerMeetLink, "_blank")}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Join
                    </Button>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openForm(meeting)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(meeting._id)}>
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
