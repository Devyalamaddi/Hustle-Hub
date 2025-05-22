"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Briefcase,
  Clock,
  CheckCircle,
  DollarSign,
  Calendar,
  Users,
  MessageSquare,
  ArrowLeft,
  Edit,
  Trash,
} from "lucide-react"
import Link from "next/link"

interface Job {
  _id: string
  title: string
  description: string
  budget: number
  status: string
  type: string
  clientId: string
  freelancers: {
    _id: string
    name: string
  }[]
  milestones: Milestone[]
  createdAt: string
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

export default function JobDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState<Job | null>(null)
  const [applications, setApplications] = useState<Gig[]>([])

  useEffect(() => {
    if (token && id) {
      Promise.all([fetchJob(), fetchApplications()]).finally(() => {
        setLoading(false)
      })
    }
  }, [token, id])

  const fetchJob = async () => {
    try {
      const response = await fetch(`https://hustle-hub-backend.onrender.com/client-api/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch job details")
      }

      const data = await response.json()
      setJob(data)
    } catch (error) {
      console.error("Error fetching job:", error)
      toast({
        title: "Error",
        description: "Failed to load job details",
        variant: "destructive",
      })
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await fetch(`https://hustle-hub-backend.onrender.com/client-api/jobs/${id}/gigs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch applications")
      }

      const data = await response.json()
      setApplications(data)
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      })
    }
  }

  const updateJobStatus = async (status: string) => {
    try {
      const response = await fetch(`https://hustle-hub-backend.onrender.com/client-api/jobs/${id}`, {
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
      setJob((prevJob) => (prevJob ? { ...prevJob, status } : null))

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

  const updateMilestoneStatus = async (milestoneId: string, status: string) => {
    try {
      const response = await fetch(`https://hustle-hub-backend.onrender.com/client-api/jobs/${id}/milestones/${milestoneId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update milestone status")
      }

      // Update local state
      setJob((prevJob) => {
        if (!prevJob) return null
        return {
          ...prevJob,
          milestones: prevJob.milestones.map((milestone) =>
            milestone._id === milestoneId ? { ...milestone, status } : milestone,
          ),
        }
      })

      toast({
        title: "Milestone updated",
        description: `Milestone status changed to ${status}`,
      })
    } catch (error) {
      console.error("Error updating milestone:", error)
      toast({
        title: "Error",
        description: "Failed to update milestone status",
        variant: "destructive",
      })
    }
  }

  const confirmFreelancer = async (application:any) => {
    try {
      const freelancers = application.teamID?.members;
      const response = await fetch(`https://hustle-hub-backend.onrender.com/client-api/jobs/${id}/confirm-gig`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(freelancers)
      });

      if (!response.ok) {
        throw new Error("Failed to confirm freelancer");
      }

      toast({
        title: "Success",
        description: "Freelancer(s) confirmed for this job",
      });

      // Refresh job and applications
      fetchJob();
      fetchApplications();
    } catch (error) {
      console.error("Error confirming freelancer:", error);
      toast({
        title: "Error",
        description: "Failed to confirm freelancer(s)",
        variant: "destructive",
      });
    }
  }

  const deleteJob = async () => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`https://hustle-hub-backend.onrender.com/client-api/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete job")
      }

      toast({
        title: "Job deleted",
        description: "The job has been successfully deleted",
      })

      router.push("/client/my-jobs")
    } catch (error) {
      console.error("Error deleting job:", error)
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    if (!name) return '';
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

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-bold mb-2">Job not found</h2>
          <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/client/my-jobs">
              <ArrowLeft size={16} className="mr-2" />
              Back to My Jobs
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/client/my-jobs">
              <ArrowLeft size={16} className="mr-1" />
              Back
            </Link>
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between gap-6">
          {/* Main Content */}
          <div className="w-full md:w-2/3 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl">{job.title}</CardTitle>
                      <Badge
                        variant={
                          job.status === "open" ? "default" : job.status === "in-progress" ? "secondary" : "outline"
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2">
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/client/jobs/${id}/edit`}>
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={deleteJob}>
                      <Trash size={16} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Budget</span>
                    <span className="font-medium flex items-center">
                      <DollarSign size={16} className="mr-1" />
                      {job.budget}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="font-medium flex items-center">
                      <Briefcase size={16} className="mr-1" />
                      {job.type}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Freelancers</span>
                    <span className="font-medium flex items-center">
                      <Users size={16} className="mr-1" />
                      {job.freelancers?.length || 0} hired
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="font-medium flex items-center">
                      {job.status === "open" && <Clock size={16} className="mr-1" />}
                      {job.status === "in-progress" && <Clock size={16} className="mr-1" />}
                      {job.status === "completed" && <CheckCircle size={16} className="mr-1" />}
                      {job.status}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {job.status === "open" && <Button onClick={() => updateJobStatus("in-progress")}>Start Project</Button>}
                {job.status === "in-progress" && (
                  <Button onClick={() => updateJobStatus("completed")}>Mark as Completed</Button>
                )}
                {job.status === "completed" && (
                  <Button variant="outline" disabled>
                    Project Completed
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Tabs defaultValue="milestones">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
              </TabsList>

              <TabsContent value="milestones" className="mt-6 space-y-4">
                {job.milestones && job.milestones.length > 0 ? (
                  job.milestones.map((milestone, index) => (
                    <Card key={milestone._id}>
                      <div className="bg-muted px-4 py-1 flex justify-between items-center text-sm">
                        <span>Milestone {index + 1}</span>
                        <Badge
                          variant={
                            milestone.status === "pending"
                              ? "secondary"
                              : milestone.status === "completed"
                                ? "default"
                                : "outline"
                          }
                        >
                          {milestone.status}
                        </Badge>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <DollarSign size={14} className="mr-1" />
                            {milestone.amount}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                      <CardFooter>
                        {milestone.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => updateMilestoneStatus(milestone._id, "completed")}
                            disabled={job.status !== "in-progress"}
                          >
                            Mark as Completed
                          </Button>
                        )}
                        {milestone.status === "completed" && (
                          <Button size="sm" variant="outline" disabled>
                            <CheckCircle size={16} className="mr-1" />
                            Completed
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <Card className="py-8">
                    <CardContent className="flex flex-col items-center justify-center text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No milestones</h3>
                      <p className="text-muted-foreground max-w-md mt-2">
                        This job doesn't have any milestones defined.
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href={`/client/jobs/${id}/edit`}>Add Milestones</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="applications" className="mt-6">
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <Card key={application._id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{getInitials(application.userID.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-base">{application.userID.name}</CardTitle>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {application.userID.skills?.slice(0, 3).map((skill, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {application.userID.skills?.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{application.userID.skills.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Badge
                              variant={
                                application.status === "accepted"
                                  ? "default"
                                  : application.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {application.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{application.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Applied on {new Date(application.createdAt).toLocaleDateString()}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          {application.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // Reject logic would go here
                                  toast({
                                    title: "Application rejected",
                                    description: "The freelancer has been notified",
                                  })
                                }}
                              >
                                Reject
                              </Button>
                              <Button size="sm" onClick={() => confirmFreelancer(application)}>
                                Hire Freelancer
                              </Button>
                            </>
                          )}
                          {application.status === "accepted" && (
                            <Button size="sm" variant="outline" className="ml-auto" >
                              <MessageSquare size={16} className="mr-1" />
                              Contact
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="py-8">
                    <CardContent className="flex flex-col items-center justify-center text-center">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No applications yet</h3>
                      <p className="text-muted-foreground max-w-md mt-2">
                        Your job hasn't received any applications yet. Check back later or try updating your job
                        description to attract more freelancers.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hired Freelancers</CardTitle>
              </CardHeader>
              <CardContent>
                {job.freelancers && job.freelancers.length > 0 ? (
                  <div className="space-y-4">
                    {job.freelancers.map((freelancer) => (
                      <div key={freelancer?._id} className="flex items-center justify-between">
                        {/* <p>{freelancer?.}</p> */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{getInitials(freelancer.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{freelancer.name}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/client/freelancers/${freelancer._id}`}>View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No freelancers hired yet</p>
                    {job.status === "open" && applications.length > 0 && (
                      <p className="text-sm mt-2">Review applications to hire freelancers</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" asChild>
                  <Link href={`/client/jobs/${id}/edit`}>
                    <Edit size={16} className="mr-2" />
                    Edit Job
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/client/post-job">
                    <Briefcase size={16} className="mr-2" />
                    Post Similar Job
                  </Link>
                </Button>
                <Button variant="destructive" className="w-full" onClick={deleteJob}>
                  <Trash size={16} className="mr-2" />
                  Delete Job
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
