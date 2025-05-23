"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  PlusCircle,
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  DollarSign,
  Search,
  AlertCircle,
  ArrowRight,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import VideoCallCard from "@/components/video/video-call-card"

// Define types for API responses
interface Job {
  _id: string
  title: string
  description: string
  budget: number
  status: string
  type: string
  freelancers: Freelancer[]
  milestones: Milestone[]
  createdAt?: string
}

interface Freelancer {
  _id: string
  name: string
  email: string
  skills: string[]
}

interface Milestone {
  _id: string
  title: string
  description: string
  amount: number
  status: string
  dueDate: string
}

interface Gig {
  _id: string
  jobID: string
  userID: {
    _id: string
    name: string
    skills: string[]
  }
  description: string
  status: string
  createdAt: string
}

export default function ClientDashboard() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<Job[]>([])
  const [activeGigs, setActiveGigs] = useState<Record<string, Gig[]>>({})
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalSpent: 0,
  })

  useEffect(() => {
    if (token) {
      Promise.all([fetchJobs()]).finally(() => {
        setLoading(false)
      })
    }
  }, [token])

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/client-api/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch jobs")
      }

      const data = await response.json()
      setJobs(data)

      // Fetch gigs for each active job
      const activeJobsData = data.filter((job:any) => job.status === "open" || job.status === "in-progress")

      for (const job of activeJobsData) {
        fetchGigsForJob(job._id)
      }

      // Update stats
      const activeCount = data.filter((job:any) => job.status === "in-progress").length
      const completedCount = data.filter((job:any) => job.status === "completed").length
      const totalSpent = data.filter((job:any) => job.status === "completed").reduce((total:any, job:any) => total + job.budget, 0)

      setStats({
        totalJobs: data.length,
        activeJobs: activeCount,
        completedJobs: completedCount,
        totalSpent: totalSpent,
      })
    } catch (error) {
      console.error("Error fetching jobs:", error)
      toast({
        title: "Error",
        description: "Failed to load your jobs",
        variant: "destructive",
      })
    }
  }

  const fetchGigsForJob = async (jobId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/client-api/jobs/${jobId}/gigs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return
      }

      const data = await response.json()
      setActiveGigs((prev) => ({
        ...prev,
        [jobId]: data,
      }))
    } catch (error) {
      console.error(`Error fetching gigs for job ${jobId}:`, error)
    }
  }

  const confirmFreelancer = async (jobId: string, freelancerId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/client-api/jobs/${jobId}/confirm-gig/${freelancerId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to confirm freelancer")
      }

      toast({
        title: "Success",
        description: "Freelancer confirmed for this job",
      })

      // Refresh jobs and gigs
      fetchJobs()
    } catch (error) {
      console.error("Error confirming freelancer:", error)
      toast({
        title: "Error",
        description: "Failed to confirm freelancer",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    if(!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
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
            <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">Manage your jobs and freelancer relationships</p>
          </div>
          <div className="flex gap-2">
            <Link href="/client/post-job">
              <Button className="flex items-center gap-2">
                <PlusCircle size={16} />
                Post New Job
              </Button>
            </Link>
            <Link href="/client/freelancers">
              <Button variant="outline" className="flex items-center gap-2">
                <Search size={16} />
                Find Freelancers
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalJobs > 0 ? `${stats.activeJobs} active` : "No jobs posted yet"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Clock size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
              <p className="text-xs text-muted-foreground">Currently in progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedJobs}</div>
              <p className="text-xs text-muted-foreground">Successfully delivered projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Investment in freelancers</p>
            </CardContent>
          </Card>
          <div className="col-span-1">
            <VideoCallCard />
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jobs">My Jobs</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="space-y-4 pt-4">
              {jobs.length > 0 ? (
                jobs.slice(0, 5).map((job) => (
                  <Card key={job._id} className="overflow-hidden">
                    <div className="bg-muted px-4 py-1 flex justify-between items-center text-sm">
                      <span>Job ID: {job._id.substring(0, 8)}...</span>
                      <Badge
                        variant={
                          job.status === "open" ? "default" : job.status === "in-progress" ? "secondary" : "outline"
                        }
                      >
                        {job.status}
                      </Badge>
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
                        {job.freelancers && job.freelancers.length > 0 && (
                          <Badge variant="secondary">
                            <Users size={12} className="mr-1" />
                            {job.freelancers.length} hired
                          </Badge>
                        )}
                      </div>
                      <Link href={`/client/jobs/${job._id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Briefcase className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No jobs posted yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mt-2">
                    You haven't posted any jobs yet. Create your first job to start finding talented freelancers.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/client/post-job">Post a Job</Link>
                  </Button>
                </div>
              )}

              {jobs.length > 5 && (
                <div className="flex justify-center pt-4">
                  <Link href="/client/my-jobs">
                    <Button variant="outline">View All Jobs</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="applications" className="pt-4">
              {Object.keys(activeGigs).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(activeGigs).map(([jobId, gigs]) => {
                    const job = jobs.find((j) => j._id === jobId)
                    if (!job || gigs.length === 0) return null

                    return (
                      <div key={jobId} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <Badge>{gigs.length} applications</Badge>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {gigs.map((gig) => (
                            <Card
                              key={gig._id}
                              className={`overflow-hidden border-l-4 ${
                                gig.status === "accepted"
                                  ? "border-green-500"
                                  : gig.status === "rejected"
                                    ? "border-red-500"
                                    : "border-blue-500"
                              }`}
                            >
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>{getInitials(gig.userID.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <CardTitle className="text-base">{gig.userID.name}</CardTitle>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {gig.userID.skills?.slice(0, 2).map((skill, i) => (
                                          <Badge key={i} variant="outline" className="text-xs">
                                            {skill}
                                          </Badge>
                                        ))}
                                        {gig.userID.skills?.length > 2 && (
                                          <Badge variant="outline" className="text-xs">
                                            +{gig.userID.skills.length - 2} more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
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
                                <CardDescription className="line-clamp-2 mt-2">{gig.description}</CardDescription>
                              </CardHeader>
                              <CardFooter className="pt-2">
                                {gig.status === "pending" && (
                                  <Button
                                    size="sm"
                                    onClick={() => confirmFreelancer(jobId, gig.userID._id)}
                                    className="w-full"
                                  >
                                    Hire Freelancer
                                  </Button>
                                )}
                                {gig.status === "accepted" && (
                                  <p className="text-sm text-green-600 flex items-center gap-1 w-full justify-center">
                                    <CheckCircle size={14} /> Freelancer hired
                                  </p>
                                )}
                                {gig.status === "rejected" && (
                                  <p className="text-sm text-red-600 flex items-center gap-1 w-full justify-center">
                                    <AlertCircle size={14} /> Application rejected
                                  </p>
                                )}
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Users className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No applications yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mt-2">
                    You don't have any freelancer applications for your jobs yet. Make sure your job descriptions are
                    clear and attractive.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Start Guide */}
        <motion.div variants={itemVariants} className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>Follow these steps to get the most out of HustleHub</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <h3 className="font-medium">Post Your First Job</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-8">
                    Create a detailed job post to attract the right freelancers.
                  </p>
                  <Link href="/client/post-job" className="text-sm text-primary hover:underline pl-8 mt-1">
                    <span className="flex items-center gap-1">
                      Post a job <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <h3 className="font-medium">Review Applications</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-8">
                    Compare freelancer proposals and select the best candidate.
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <h3 className="font-medium">Track Progress</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-8">
                    Manage milestones and communicate with hired freelancers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
