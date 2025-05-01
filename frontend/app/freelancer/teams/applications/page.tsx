"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Briefcase, Clock, Users } from "lucide-react"
import Link from "next/link"

interface TeamApplication {
  _id: string
  jobID: {
    _id: string
    title: string
    budget: number
    clientId: {
      _id: string
      name: string
    }
  }
  teamID: {
    _id: string
    name: string
    members: {
      _id: string
      name: string
    }[]
  }
  description: string
  status: string
  createdAt: string
}

export default function TeamApplicationsPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<TeamApplication[]>([])

  useEffect(() => {
    if (token) {
      fetchTeamApplications()
    }
  }, [token])

  const fetchTeamApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8080/freelancer-api/team-applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch team applications")
      }

      const data = await response.json()
      setApplications(data)
    } catch (error) {
      console.error("Error fetching team applications:", error)
      toast({
        title: "Error",
        description: "Failed to load team applications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const withdrawApplication = async (applicationId: string) => {
    if (!confirm("Are you sure you want to withdraw this application?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/freelancer-api/team-applications/${applicationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to withdraw application")
      }

      setApplications(applications.filter((app) => app._id !== applicationId))

      toast({
        title: "Application withdrawn",
        description: "Your team application has been withdrawn successfully",
      })
    } catch (error) {
      console.error("Error withdrawing application:", error)
      toast({
        title: "Error",
        description: "Failed to withdraw application",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    if (!name) return ""
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

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Team Applications</h1>
            <p className="text-muted-foreground">Manage your team's job applications</p>
          </div>
          <Link href="/freelancer/teams">
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manage Teams
            </Button>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Applications</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <ApplicationsList applications={applications} onWithdraw={withdrawApplication} />
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <ApplicationsList
                applications={applications.filter((app) => app.status === "pending")}
                onWithdraw={withdrawApplication}
              />
            </TabsContent>

            <TabsContent value="accepted" className="mt-6">
              <ApplicationsList
                applications={applications.filter((app) => app.status === "accepted")}
                onWithdraw={withdrawApplication}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}

function ApplicationsList({
  applications,
  onWithdraw,
}: {
  applications: TeamApplication[]
  onWithdraw: (id: string) => void
}) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No applications found</h3>
        <p className="mt-2 text-muted-foreground">
          Your team hasn't applied for any jobs yet or there are no applications matching the selected filter.
        </p>
        <Link href="/freelancer/jobs">
          <Button className="mt-4">Browse Jobs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {applications.map((application) => (
        <Card key={application._id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  <Link href={`/freelancer/jobs/${application.jobID._id}`} className="hover:underline">
                    {application.jobID.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  Applied as team:{" "}
                  <Link href={`/freelancer/teams/${application.teamID._id}`} className="font-medium hover:underline">
                    {application.teamID.name}
                  </Link>
                </CardDescription>
              </div>
              <Badge
                variant={
                  application.status === "accepted"
                    ? "success"
                    : application.status === "rejected"
                      ? "destructive"
                      : "default"
                }
              >
                {application.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Application Details</h3>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4" />
                    <span>Applied on {new Date(application.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Budget: ${application.jobID.budget}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">Application Note</h4>
                  <p className="text-sm line-clamp-3">{application.description}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Team Members</h3>
                <div className="flex flex-wrap gap-2">
                  {application.teamID.members.slice(0, 5).map((member) => (
                    <div key={member._id} className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                    </div>
                  ))}
                  {application.teamID.members.length > 5 && (
                    <div className="flex items-center">
                      <Badge variant="outline">+{application.teamID.members.length - 5} more</Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/freelancer/jobs/${application.jobID._id}`}>
              <Button variant="outline" size="sm">
                View Job
              </Button>
            </Link>
            {application.status === "pending" && (
              <Button variant="destructive" size="sm" onClick={() => onWithdraw(application._id)}>
                Withdraw Application
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
