"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react"
import Link from "next/link"

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
}

interface Gig {
  _id: string
  jobID: Job
  description: string
  status: string
  createdAt: string
  feedback?: string
}

export default function FreelancerGigs() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [gigs, setGigs] = useState<Gig[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (token) {
      fetchGigs().finally(() => {
        setLoading(false)
      })
    }
  }, [token])

  const fetchGigs = async () => {
    try {
      const response = await fetch("https://hustle-hub-backend.onrender.com/freelancer-api/gigs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch gigs")
      }

      const data = await response.json()
      setGigs(data)
    } catch (error) {
      console.error("Error fetching gigs:", error)
      toast({
        title: "Error",
        description: "Failed to load your applications",
        variant: "destructive",
      })
    }
  }

  const withdrawApplication = async (gigId: string) => {
    try {
      const response = await fetch(`https://hustle-hub-backend.onrender.com/freelancer-api/gigs/${gigId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to withdraw application")
      }

      // Update local state
      setGigs((prevGigs) => prevGigs.filter((gig) => gig._id !== gigId))

      toast({
        title: "Application withdrawn",
        description: "Your application has been successfully withdrawn",
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

  // Filter gigs based on active tab
  const filteredGigs = () => {
    if (activeTab === "all") return gigs
    if (activeTab === "pending") return gigs.filter((gig) => gig.status === "pending")
    if (activeTab === "accepted") return gigs.filter((gig) => gig.status === "accepted")
    if (activeTab === "rejected") return gigs.filter((gig) => gig.status === "rejected")
    if (activeTab === "completed") return gigs.filter((gig) => gig.status === "completed")
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
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">Track the status of your job applications</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Briefcase size={16} />
                All
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock size={16} />
                Pending
              </TabsTrigger>
              <TabsTrigger value="accepted" className="flex items-center gap-2">
                <CheckCircle size={16} />
                Accepted
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <XCircle size={16} />
                Rejected
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle size={16} />
                Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <GigsList gigs={filteredGigs()} withdrawApplication={withdrawApplication} />
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <GigsList gigs={filteredGigs()} withdrawApplication={withdrawApplication} />
            </TabsContent>

            <TabsContent value="accepted" className="mt-6">
              <GigsList gigs={filteredGigs()} withdrawApplication={withdrawApplication} />
            </TabsContent>

            <TabsContent value="rejected" className="mt-6">
              <GigsList gigs={filteredGigs()} withdrawApplication={withdrawApplication} />
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <GigsList gigs={filteredGigs()} withdrawApplication={withdrawApplication} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}

interface GigsListProps {
  gigs: Gig[]
  withdrawApplication: (gigId: string) => Promise<void>
}

function GigsList({ gigs, withdrawApplication }: GigsListProps) {
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "accepted":
        return <Badge variant="default">Accepted</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "completed":
        return <Badge variant="outline">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (gigs.length === 0) {
    return (
      <Card className="py-10">
        <CardContent className="flex flex-col items-center justify-center text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No applications found</h3>
          <p className="text-muted-foreground max-w-md mt-2">You don't have any applications in this category.</p>
          <Link href="/freelancer/jobs" className="mt-4">
            <Button>Find Jobs</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {gigs.map((gig) => (
        <Card key={gig._id} className="overflow-hidden">
          <div className="bg-muted px-4 py-1 flex justify-between items-center text-sm">
            <span>Applied on: {new Date(gig.createdAt).toLocaleDateString()}</span>
            {renderStatusBadge(gig.status)}
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-4">
              <div>
                <CardTitle className="text-lg">{gig.jobID?.title || "Unknown Job"}</CardTitle>
                <CardDescription className="mt-1">
                  <span className="font-medium">Client:</span> {gig.jobID?.clientId?.companyName || "Unknown Client"}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="font-medium text-lg">${gig.jobID?.budget || 0}</div>
                <div className="text-xs text-muted-foreground">{gig.jobID?.type || "Unknown Type"}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div>
                <h4 className="text-sm font-medium">Your Proposal:</h4>
                <p className="text-sm text-muted-foreground">{gig.description}</p>
              </div>
              {gig.feedback && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <h4 className="text-sm font-medium">Client Feedback:</h4>
                  <p className="text-sm">{gig.feedback}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-0">
            <div className="flex gap-2">
              {gig.status === "pending" && (
                <Button size="sm" variant="outline" onClick={() => withdrawApplication(gig._id)}>
                  Withdraw Application
                </Button>
              )}
              {gig.status === "accepted" && (
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/freelancer/jobs/${gig.jobID?._id}`}>View Job Details</Link>
                </Button>
              )}
            </div>
            {(gig.status === "accepted" || gig.status === "completed") && (
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <MessageSquare size={16} />
                Contact Client
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
