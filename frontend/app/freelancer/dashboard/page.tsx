"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Search, Briefcase, Clock, DollarSign, ThumbsUp, Users } from "lucide-react"
import Link from "next/link"
import VideoCallCard from "@/components/video/video-call-card"
import { useRouter } from "next/navigation"

// Define types for API responses
interface Job {
  _id: string
  title: string
  description: string
  budget: number
  status: string
  type: string
  clientId: {
    _id: string
    name: string
    companyName: string
  }
  createdAt?: string
}

interface Gig {
  _id: string
  jobID: Job
  description: string
  status: string
  createdAt: string
}

interface Team {
  _id: string
  name: string
  members: string[]
  status: string
}

interface TeamInvitation {
  _id: string
  teamID: {
    _id: string
    name: string
  }
  from: {
    _id: string
    name: string
  }
  status: string
  createdAt: string
}

export default function FreelancerDashboard() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<Job[]>([])
  const [gigs, setGigs] = useState<Gig[]>([])
  const [invitations, setInvitations] = useState<TeamInvitation[]>([])
  const [stats, setStats] = useState({
    appliedJobs: 0,
    activeGigs: 0,
    completedGigs: 0,
    earnings: 0,
  })
  const router = useRouter();
  const [lsUser, setlsUser] = useState<any>("");

  const getUserFromLS = () =>{
    setlsUser(JSON.parse(localStorage.getItem("user") || ""));
  }


  const fetchJobs = async () => {
    try {
      const response = await fetch(`http://localhost:8080/freelancer-api/job-posts/${lsUser?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch jobs")
      }

      const data = await response.json()
      setJobs(data)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      toast({
        title: "Error",
        description: "Failed to load job listings",
        variant: "destructive",
      })
    }
  }

  const fetchGigs = async () => {
    try {
      const response = await fetch("http://localhost:8080/freelancer-api/gigs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch gigs")
      }

      const data = await response.json()
      setGigs(data)

      // Update stats based on gigs
      const activeCount = data.filter((gig:any) => gig.status === "pending" || gig.status === "accepted").length
      const completedCount = data.filter((gig:any) => gig.status === "completed").length
      const totalEarnings = data
        .filter((gig:any) => gig.status === "completed")
        .reduce((total:any, gig:any) => total + (gig.jobID?.budget || 0), 0)

      setStats({
        appliedJobs: data.length,
        activeGigs: activeCount,
        completedGigs: completedCount,
        earnings: totalEarnings,
      })
    } catch (error) {
      console.error("Error fetching gigs:", error)
      toast({
        title: "Error",
        description: "Failed to load your gigs",
        variant: "destructive",
      })
    }
  }

  const fetchInvitations = async () => {
    try {
      const response = await fetch("http://localhost:8080/freelancer-api/team-invitations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch team invitations")
      }

      const data = await response.json()
      setInvitations(data)
    } catch (error) {
      console.error("Error fetching team invitations:", error)
      // Silent fail for invitations
    }
  }

  const handleInvitation = async (invitationId: string, teamId: string, action: "accept" | "reject") => {
    try {
      const endpoint = `http://localhost:8080/freelancer-api/teams/${teamId}/${action}-invitation`
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} invitation`)
      }

      // Update invitations list
      fetchInvitations()

      toast({
        title: "Success",
        description: `You've ${action}ed the team invitation`,
      })
    } catch (error) {
      console.error(`Error ${action}ing invitation:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} invitation`,
        variant: "destructive",
      })
    }
  }

  const applyForJob = async (jobId: string) => {
    try {
      const response = await fetch("http://localhost:8080/freelancer-api/gigs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobID: jobId,
          description: `I'm interested in working on this project and believe my skills are a good match.`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to apply for job")
      }

      toast({
        title: "Application submitted",
        description: "You've successfully applied for this job",
      })

      // Refresh gigs list
      fetchGigs()
    } catch (error) {
      console.error("Error applying for job:", error)
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      })
    }
  }

  // Check if user has already applied for a job
  const hasApplied = (jobId: string) => {
    return gigs.some((gig) => gig.jobID?._id === jobId)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  useEffect(() => {
    getUserFromLS();
    if (token) {
      Promise.all([fetchJobs(), fetchGigs(), fetchInvitations()]).finally(() => {
        setLoading(false)
      })
    }
    
  }, [token])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">Here's an overview of your freelance activity</p>
          </div>
          <div className="flex gap-2">
            <Link href="/freelancer/jobs">
              <Button className="flex items-center gap-2">
                <Search size={16} />
                Find Jobs
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applied Jobs</CardTitle>
              <Briefcase size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.appliedJobs}</div>
              <p className="text-xs text-muted-foreground">
                {stats.appliedJobs > 0 ? `${stats.activeGigs} active` : "No applications yet"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Gigs</CardTitle>
              <Clock size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeGigs}</div>
              <p className="text-xs text-muted-foreground">Current ongoing projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <ThumbsUp size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedGigs}</div>
              <p className="text-xs text-muted-foreground">Successfully delivered projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <DollarSign size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.earnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total earned from gigs</p>
            </CardContent>
          </Card>
          <div className="col-span-1" onClick={()=> router.push("/client/meetings")}>
            <VideoCallCard  />
          </div>
        </motion.div>

        {/* Team Invitations */}
        {invitations.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-blue-600" />
              <h2 className="text-lg font-semibold">Team Invitations</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {invitations.map((invitation) => (
                <Card key={invitation._id} className="overflow-hidden border-l-4 border-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{invitation.teamID.name}</CardTitle>
                    <CardDescription>Invited by {invitation.from.name}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInvitation(invitation._id, invitation.teamID._id, "reject")}
                    >
                      Decline
                    </Button>
                    <Button size="sm" onClick={() => handleInvitation(invitation._id, invitation.teamID._id, "accept")}>
                      Accept
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Content Tabs */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jobs">Recent Jobs</TabsTrigger>
              <TabsTrigger value="gigs">My Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="space-y-4 pt-4">
              {jobs.length > 0 ? (
                jobs.slice(0, 5).map((job) => (
                  <Card key={job._id} className="overflow-hidden">
                    <div className="bg-muted px-4 py-1 flex justify-between items-center text-sm">
                      <span>{job.clientId?.companyName || "Company"}</span>
                      <Badge variant={job.status === "open" ? "default" : "secondary"}>{job.status}</Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <p className="font-medium text-lg">${job.budget}</p>
                      </div>
                      <CardDescription className="line-clamp-2">{job.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex gap-2">
                        <Badge variant="outline">{job.type}</Badge>
                      </div>
                      <Button
                        size="sm"
                        disabled={hasApplied(job._id) || job.status !== "open"}
                        onClick={() => applyForJob(job._id)}
                      >
                        {hasApplied(job._id) ? "Applied" : "Apply Now"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Search className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No jobs found</h3>
                  <p className="text-muted-foreground text-center max-w-md mt-2">
                    We couldn't find any jobs matching your skills. Check back later or update your profile.
                  </p>
                </div>
              )}

              {jobs.length > 5 && (
                <div className="flex justify-center pt-4">
                  <Link href="/freelancer/jobs">
                    <Button variant="outline">View All Jobs</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="gigs" className="space-y-4 pt-4">
              {gigs.length > 0 ? (
                gigs.slice(0, 5).map((gig) => (
                  <Card key={gig._id} className="overflow-hidden">
                    <div className="bg-muted px-4 py-1 flex justify-between items-center text-sm">
                      <span>Application for: {gig.jobID?.title || "Job"}</span>
                      <Badge
                        variant={
                          gig.status === "accepted"
                            ? "default"
                            : gig.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {gig.status}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{gig.jobID?.title || "Unknown Job"}</CardTitle>
                      <CardDescription className="line-clamp-2">{gig.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-2 flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {new Date(gig.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        {gig.status === "accepted" && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <ThumbsUp size={12} className="mr-1" /> Hired
                          </Badge>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Briefcase className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No applications yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mt-2">
                    You haven't applied to any jobs yet. Browse available jobs and start submitting applications.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/freelancer/jobs">Find Jobs</Link>
                  </Button>
                </div>
              )}

              {gigs.length > 5 && (
                <div className="flex justify-center pt-4">
                  <Link href="/freelancer/gigs">
                    <Button variant="outline">View All Applications</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}
