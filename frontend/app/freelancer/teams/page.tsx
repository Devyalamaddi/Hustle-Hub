"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, Plus, Settings, UserPlus, Users, X } from "lucide-react"
import Link from "next/link"

interface TeamMember {
  _id: string
  name: string
  email: string
}

interface Team {
  _id: string
  name: string
  members: TeamMember[]
  roles: Record<string, string>
  status: string
  createdAt: string
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
    email: string
  }
  status: string
  createdAt: string
}

export default function TeamsPage() {
  const { token, user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState<Team[]>([])
  const [invitations, setInvitations] = useState<TeamInvitation[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (token) {
      Promise.all([fetchTeams(), fetchInvitations()]).finally(() => {
        setLoading(false)
      })
    }
  }, [token])

  const fetchTeams = async () => {
    try {
      const response = await fetch("https://hustle-hub-backend.onrender.com/freelancer-api/teams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch teams")
      }

      const data = await response.json()
      setTeams(data)
    } catch (error) {
      console.error("Error fetching teams:", error)
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive",
      })
    }
  }

  const fetchInvitations = async () => {
    try {
      const response = await fetch("https://hustle-hub-backend.onrender.com/freelancer-api/team-invitations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch invitations")
      }

      const data = await response.json()
      setInvitations(data)
    } catch (error) {
      console.error("Error fetching invitations:", error)
    }
  }

  const handleInvitationResponse = async (invitationId: string, teamId: string, accept: boolean) => {
    setIsProcessing(true)
    try {
      const endpoint = accept ? "accept-invitation" : "reject-invitation"
      const response = await fetch(`https://hustle-hub-backend.onrender.com/freelancer-api/teams/${teamId}/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to ${accept ? "accept" : "reject"} invitation`)
      }

      // Update invitations list
      setInvitations(invitations.filter((inv) => inv._id !== invitationId))

      // If accepted, refresh teams
      if (accept) {
        await fetchTeams()
      }

      toast({
        title: accept ? "Invitation accepted" : "Invitation rejected",
        description: accept ? "You have successfully joined the team" : "You have rejected the team invitation",
      })
    } catch (error) {
      console.error(`Error ${accept ? "accepting" : "rejecting"} invitation:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${accept ? "accept" : "reject"} invitation`,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLeaveTeam = async () => {
    if (!selectedTeam) return

    setIsProcessing(true)
    try {
      const response = await fetch(`https://hustle-hub-backend.onrender.com/freelancer-api/teams/${selectedTeam._id}/leave`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to leave team")
      }

      setTeams(teams.filter((team) => team._id !== selectedTeam._id))
      setIsLeaveDialogOpen(false)
      setSelectedTeam(null)

      toast({
        title: "Team left",
        description: "You have successfully left the team",
      })
    } catch (error) {
      console.error("Error leaving team:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to leave team",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const isTeamAdmin = (team: Team) => {
    if (!user) return false
    return team?.roles[user?._id] === "admin" || team?.members[0]?._id === user?._id
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
            <h1 className="text-3xl font-bold">Teams</h1>
            <p className="text-muted-foreground">Create and manage your teams for collaborative projects</p>
          </div>
          <Link href="/freelancer/teams/create">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="myTeams">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="myTeams">My Teams</TabsTrigger>
              <TabsTrigger value="invitations">
                Invitations
                {invitations.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {invitations.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="myTeams" className="mt-6">
              {teams.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {teams.map((team) => (
                    <Card key={team._id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          <Badge variant={team.status === "active" ? "default" : "secondary"}>{team.status}</Badge>
                        </div>
                        <CardDescription>Created {new Date(team.createdAt).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <h3 className="text-sm font-medium mb-2">Team Members ({team.members.length})</h3>
                        <div className="flex flex-wrap gap-2">
                          {team.members.slice(0, 5).map((member) => (
                            <div key={member._id} className="flex items-center gap-1">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs">
                                {member.name}
                                {team.roles[member._id] === "admin" && (
                                  <Badge variant="outline" className="ml-1 text-[0.6rem] py-0">
                                    Admin
                                  </Badge>
                                )}
                              </span>
                            </div>
                          ))}
                          {team.members.length > 5 && <Badge variant="outline">+{team.members.length - 5} more</Badge>}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Link href={`/freelancer/teams/${team._id}`}>
                          <Button variant="outline" size="sm">
                            <Settings className="mr-2 h-3 w-3" />
                            Manage
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setSelectedTeam(team)
                            setIsLeaveDialogOpen(true)
                          }}
                        >
                          <X className="mr-2 h-3 w-3" />
                          Leave
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No teams found</h3>
                  <p className="mt-2 text-muted-foreground">
                    You haven't created or joined any teams yet. Create a team to collaborate with other freelancers.
                  </p>
                  <Link href="/freelancer/teams/create">
                    <Button className="mt-4">Create Team</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="invitations" className="mt-6">
              {invitations.length > 0 ? (
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <Card key={invitation._id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Invitation to join {invitation.teamID.name}</CardTitle>
                        <CardDescription>
                          From {invitation.from.name} ({invitation.from.email})
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground">
                          Received on {new Date(invitation.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => handleInvitationResponse(invitation._id, invitation.teamID._id, false)}
                        >
                          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject"}
                        </Button>
                        <Button
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => handleInvitationResponse(invitation._id, invitation.teamID._id, true)}
                        >
                          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accept"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <UserPlus className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No invitations</h3>
                  <p className="mt-2 text-muted-foreground">
                    You don't have any pending team invitations at the moment.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      <AlertDialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Team</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this team?{" "}
              {isTeamAdmin(selectedTeam!) && "As an admin, if you leave, another member will be promoted to admin."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isProcessing} onClick={handleLeaveTeam}>
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Leave Team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
