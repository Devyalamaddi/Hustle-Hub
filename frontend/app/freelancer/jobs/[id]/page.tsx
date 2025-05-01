"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { JobApplicationDialog } from "@/components/job-application-dialog"
import { Briefcase, Calendar, Clock, DollarSign, User, Users } from "lucide-react"
import Link from "next/link"

interface Job {
  _id: string
  title: string
  description: string
  budget: number
  duration: string
  skills: string[]
  status: string
  clientId: {
    _id: string
    name: string
  }
  createdAt: string
  teamRequired?: boolean
  minTeamSize?: number
  maxTeamSize?: number
}

export default function JobDetailPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState<Job | null>(null)
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false)

  useEffect(() => {
    if (token && id) {
      fetchJob()
    }
  }, [token, id])

  const fetchJob = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8080/freelancer-api/job-posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch job")
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
    } finally {
      setLoading(false)
    }
  }

  const handleApplicationSuccess = () => {
    toast({
      title: "Application submitted",
      description: "Your application has been successfully submitted",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Job not found</h3>
          <p className="mt-2 text-muted-foreground">The job you're looking for doesn't exist or has been removed.</p>
          <Link href="/freelancer/jobs">
            <Button className="mt-4">Browse Jobs</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={job.status === "open" ? "default" : "secondary"}>{job.status}</Badge>
              {job.teamRequired && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> Team Required
                </Badge>
              )}
            </div>
          </div>
          <Button
            onClick={() => setIsApplicationDialogOpen(true)}
            disabled={job.status !== "open"}
            className="w-full md:w-auto"
          >
            {job.status === "open" ? "Apply Now" : "Job Closed"}
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{job.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {job.teamRequired && (
              <Card>
                <CardHeader>
                  <CardTitle>Team Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Team Size</h3>
                    <p>
                      This job requires a team of {job.minTeamSize || 2} to {job.maxTeamSize || "any number of"}{" "}
                      members.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">How to Apply as a Team</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Create or join a team from the Teams page</li>
                      <li>Return to this job and click "Apply Now"</li>
                      <li>Select your team from the dropdown menu</li>
                      <li>Submit your team's application</li>
                    </ol>
                  </div>
                  <div className="flex justify-center mt-4">
                    <Link href="/freelancer/teams">
                      <Button variant="outline">
                        <Users className="mr-2 h-4 w-4" />
                        Manage Teams
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Budget</span>
                  </div>
                  <span className="font-medium">${job.budget}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Duration</span>
                  </div>
                  <span className="font-medium">{job.duration}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Posted On</span>
                  </div>
                  <span className="font-medium">{formatDate(job.createdAt)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Client</span>
                  </div>
                  <Link href={`/freelancer/clients/${job.clientId._id}`} className="font-medium hover:underline">
                    {job.clientId.name}
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Similar jobs will be displayed here based on the skills required for this job.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/freelancer/jobs" className="w-full">
                  <Button variant="outline" className="w-full">
                    Browse All Jobs
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </motion.div>

      <JobApplicationDialog
        isOpen={isApplicationDialogOpen}
        onClose={() => setIsApplicationDialogOpen(false)}
        jobId={job._id}
        jobTitle={job.title}
        jobDescription={job.description}
        onSuccess={handleApplicationSuccess}
      />
    </div>
  )
}
