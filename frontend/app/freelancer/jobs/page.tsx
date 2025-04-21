"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobApplicationDialog } from "@/components/job-application-dialog"
import { Briefcase, Calendar, Clock, DollarSign, Search, User } from "lucide-react"

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
}

export default function JobsPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false)

  useEffect(() => {
    if (token) {
      fetchJobs()
    }
  }, [token])

  useEffect(() => {
    if (searchTerm) {
      const filtered = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredJobs(filtered)
    } else {
      setFilteredJobs(jobs)
    }
  }, [searchTerm, jobs])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/freelancer-api/job-posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch jobs")
      }

      const data = await response.json()
      setJobs(data)
      setFilteredJobs(data)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job)
    setIsApplicationDialogOpen(true)
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
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Available Jobs</h1>
            <p className="text-muted-foreground">Browse and apply for available jobs</p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search jobs..."
              className="pl-10 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="team">Team Jobs</TabsTrigger>
              <TabsTrigger value="individual">Individual Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <JobList jobs={filteredJobs} onApplyClick={handleApplyClick} />
            </TabsContent>

            <TabsContent value="team" className="mt-6">
              <JobList jobs={filteredJobs.filter((job) => job.teamRequired)} onApplyClick={handleApplyClick} />
            </TabsContent>

            <TabsContent value="individual" className="mt-6">
              <JobList jobs={filteredJobs.filter((job) => !job.teamRequired)} onApplyClick={handleApplyClick} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      {selectedJob && (
        <JobApplicationDialog
          isOpen={isApplicationDialogOpen}
          onClose={() => setIsApplicationDialogOpen(false)}
          jobId={selectedJob._id}
          jobTitle={selectedJob.title}
          jobDescription={selectedJob.description}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  )
}

function JobList({ jobs, onApplyClick }: { jobs: Job[]; onApplyClick: (job: Job) => void }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No jobs found</h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search or check back later for new opportunities.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <Card key={job._id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <Badge variant={job.status === "open" ? "default" : "secondary"}>{job.status}</Badge>
            </div>
            <CardDescription className="flex items-center gap-1">
              <User className="h-3 w-3" /> {job.clientId.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm line-clamp-3 mb-4">{job.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-muted-foreground" />
                <span>${job.budget}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span>{job.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                {job.teamRequired ? (
                  <Badge variant="outline" className="text-xs">
                    Team Required
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Individual
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1">
              {job?.skills?.slice(0, 3).map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job?.skills?.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{job?.skills?.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => onApplyClick(job)} disabled={job.status !== "open"}>
              {job.status === "open" ? "Apply Now" : "Closed"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
