"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Mail, Search, Shield, UserMinus, UserPlus, Users } from "lucide-react"
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

interface Freelancer {
  _id: string
  name: string
  email: string
  skills: string[]
}

export default function TeamDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { token, user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState<Team | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [filteredFreelancers, setFilteredFreelancers] = useState<Freelancer[]>([])
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("member")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (token && id) {
      Promise.all([fetchTeam(), fetchFreelancers()]).finally(() => {
        setLoading(false)
      })
    }
  }, [token, id])

  useEffect(() => {
    if (searchTerm && freelancers.length > 0) {
      const filtered = freelancers.filter(
        (f) =>
          f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredFreelancers(filtered)
    } else {
      setFilteredFreelancers(freelancers)
    }
  }, [searchTerm, freelancers])

  const fetchTeam = async () => {
    try {
      const response = await fetch(`/api/freelancer-api/teams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch team")
      }

      const data = await response.json()
      setTeam(data)
    } catch (error) {
      console.error("Error fetching team:", error)
      toast({
        title: "Error",
        description: "Failed to load team details",
        variant: "destructive",
      })
      router.push("/freelancer/teams")
    }
  }

  const fetchFreelancers = async () => {
    try {
      const response = await fetch("/api/freelancer-api/freelancers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch freelancers")
      }

      const data = await response.json()
      setFreelancers(data)
      setFilteredFreelancers(data)
    } catch (error) {
      console.error("Error fetching freelancers:", error)
    }
  }

  const sendInvitation = async () => {
    if (!selectedFreelancer) return

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/freelancer-api/teams/${id}/invite/${selectedFreelancer._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to send invitation")
      }

      setIsInviteDialogOpen(false)
      setSelectedFreelancer(null)

      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${selectedFreelancer.name}`,
      })
    } catch (error) {
      console.error("Error sending invitation:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invitation",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const removeMember = async () => {
    if (!selectedMember) return

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/freelancer-api/teams/${id}/remove/${selectedMember._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to remove member")
      }

      await fetchTeam()
      setIsRemoveDialogOpen(false)
      setSelectedMember(null)

      toast({
        title: "Member removed",
        description: `${selectedMember.name} has been removed from the team`,
      })
    } catch (error) {
      console.error("Error removing member:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove member",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const updateMemberRole = async () => {
    if (!selectedMember || !selectedRole) return

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/freelancer-api/teams/${id}/members/${selectedMember._id}/role`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      })

      if (!response.ok) {
        throw new Error("Failed to update member role")
      }

      await fetchTeam()
      setIsRoleDialogOpen(false)
      setSelectedMember(null)

      toast({
        title: "Role updated",
        description: `${selectedMember.name}'s role has been updated to ${selectedRole}`,
      })
    } catch (error) {
      console.error("Error updating member role:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update member role",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const isTeamAdmin = () => {
    if (!user || !team) return false
    return team.roles[user._id] === "admin" || team.members[0]?._id === user._id
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

  if (!team) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Team not found</h3>
          <p className="mt-2 text-muted-foreground">
            The team you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link href="/freelancer/teams">
            <Button className="mt-4">Back to Teams</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{team.name}</h1>
              <Badge variant={team.status === "active" ? "default" : "secondary"}>{team.status}</Badge>
            </div>
            <p className="text-muted-foreground">
              Created on {new Date(team.createdAt).toLocaleDateString()} • {team.members.length} members
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/freelancer/teams">
              <Button variant="outline">Back to Teams</Button>
            </Link>
            {isTeamAdmin() && (
              <Button onClick={() => setIsInviteDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team members and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {team.roles[member._id] || "Member"}
                      </Badge>
                      {isTeamAdmin() && member._id !== user?._id && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedMember(member)
                              setSelectedRole(team.roles[member._id] || "member")
                              setIsRoleDialogOpen(true)
                            }}
                          >
                            Change Role
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setSelectedMember(member)
                              setIsRemoveDialogOpen(true)
                            }}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Team Applications</CardTitle>
              <CardDescription>View and manage job applications submitted by your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Link href="/freelancer/teams/applications">
                  <Button>View Team Applications</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Invite Member to Team</DialogTitle>
            <DialogDescription>
              Search for freelancers to invite to your team. They will receive an invitation to join.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search freelancers..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredFreelancers
                .filter((f) => !team.members.some((m) => m._id === f._id))
                .map((freelancer) => (
                  <div
                    key={freelancer._id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      selectedFreelancer?._id === freelancer._id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-accent/50"
                    } cursor-pointer`}
                    onClick={() => setSelectedFreelancer(freelancer)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(freelancer.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{freelancer.name}</div>
                        <div className="text-sm text-muted-foreground">{freelancer.email}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {freelancer.skills.slice(0, 2).map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {freelancer.skills.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{freelancer.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              {filteredFreelancers.filter((f) => !team.members.some((m) => m._id === f._id)).length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No freelancers found matching your search</div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendInvitation} disabled={!selectedFreelancer || isProcessing}>
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Dialog */}
      <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedMember?.name} from the team? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isProcessing} onClick={removeMember}>
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Member Role</DialogTitle>
            <DialogDescription>Update the role for {selectedMember?.name} in the team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateMemberRole} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
