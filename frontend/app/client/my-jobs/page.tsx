"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Briefcase, PlusCircle, Users, Clock, CheckCircle } from "lucide-react"

interface Job {
  _id: string
  title: string
  description: string
  budget: number
  status: string
  type: string
  freelancers: {
    _id: string
    name: string
  }[]
  milestones: {
    _id: string
    title: string
    status: string
  }[]
  createdAt?: string
}

export default function ClientJobs() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<Job[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (token) {
      fetchJobs().finally(() => {
        setLoading(false)
      })
    }
  }, [token])

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:8080/client-api/jobs", {
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
        description: "Failed to load your jobs",
        variant: "destructive",
      })
    }
  }

  const updateJobStatus = async (jobId: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:8080/client-api/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update job status")
      }

      // Update local state
      setJobs((prevJobs) => prevJobs.map((job) => (job._id === jobId ? { ...job, status } : job)))

      toast({
        title: "Job updated",
        description: `Job status changed to ${status}`,
      })
    } catch (error) {
      console.error("Error updating job:", error)
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive",
      })
    }
  }

  // Filter jobs based on active tab
  const filteredJobs = () => {
    if (activeTab === "all") return jobs
    if (activeTab === "open") return jobs.filter((job) => job.status === "open")
    if (activeTab === "in-progress") return jobs.filter((job) => job.status === "in-progress")
    if (activeTab === "completed") return jobs.filter((job) => job.status === "completed")
    return []
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold">My Jobs</h1>
            <p className="text-muted-foreground">Manage all your job postings</p>
          </div>
          <Link href="/client/post-job">
            <Button className="flex items-center gap-2">
              <PlusCircle size={16} />
              Post New Job
            </Button>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Briefcase size={16} />
                All
              </TabsTrigger>
              <TabsTrigger value="open" className="flex items-center gap-2">
                <PlusCircle size={16} />
                Open
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="flex items-center gap-2">
                <Clock size={16} />
                In Progress
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle size={16} />
                Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <JobsList jobs={filteredJobs()} updateJobStatus={updateJobStatus} />
            </TabsContent>

            <TabsContent value="open" className="mt-6">
              <JobsList jobs={filteredJobs()} updateJobStatus={updateJobStatus} />
            </TabsContent>

            <TabsContent value="in-progress" className="mt-6">
              <JobsList jobs={filteredJobs()} updateJobStatus={updateJobStatus} />
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <JobsList jobs={filteredJobs()} updateJobStatus={updateJobStatus} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}

interface JobsListProps {
  jobs: Job[]
  updateJobStatus: (jobId: string, status: string) => Promise<void>
}

function JobsList({ jobs, updateJobStatus }: JobsListProps) {
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="default">Open</Badge>
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>
      case "completed":
        return <Badge variant="outline">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (jobs.length === 0) {
    return (
      <Card className="py-10">
        <CardContent className="flex flex-col items-center justify-center text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No jobs found</h3>
          <p className="text-muted-foreground max-w-md mt-2">You don't have any jobs in this category.</p>
          <Link href="/client/post-job" className="mt-4">
            <Button>
              <PlusCircle size={16} className="mr-2" />
              Post a New Job
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job._id} className="overflow-hidden">
          <div className="bg-muted px-4 py-1 flex justify-between items-center text-sm">
            <span>Job ID: {job._id.substring(0, 8)}...</span>
            {renderStatusBadge(job.status)}
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-4">
              <div>
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">{job.description}</CardDescription>
              </div>
              <div className="text-right">
                <div className="font-medium text-lg">${job.budget}</div>
                <div className="text-xs text-muted-foreground">
                  {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recent"}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{job.type}</Badge>
              {job.freelancers && job.freelancers.length > 0 ? (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users size={12} />
                  {job.freelancers.length} {job.freelancers.length === 1 ? "freelancer" : "freelancers"}
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users size={12} />
                  No freelancers yet
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-0">
            <div className="flex gap-2">
              {job.status === "open" && (
                <Button size="sm" variant="outline" onClick={() => updateJobStatus(job._id, "in-progress")}>
                  Start Project
                </Button>
              )}
              {job.status === "in-progress" && (
                <Button size="sm" variant="outline" onClick={() => updateJobStatus(job._id, "completed")}>
                  Mark Completed
                </Button>
              )}
            </div>
            <Link href={`/client/jobs/${job._id}`}>
              <Button size="sm">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
