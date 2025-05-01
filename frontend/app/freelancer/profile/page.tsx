"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Star, Users, Mail, Link as LinkIcon, Edit, Save, X } from "lucide-react"

export default function FreelancerProfilePage() {
  const { token} = useAuth()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    skills: [] as string[],
    experience: "",
    portfolio: "",
    rating: 0,
    completedJobs: 0,
  })

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({ ...profile })

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`http://localhost:8080/freelancer-api/freelancers/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }
        const data = await response.json()
        setProfile(data)
        setFormData(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    if (token) {
      fetchProfile()
    }
  }, [token, toast])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "skills" ? value.split(",").map((s) => s.trim()) : value,
    }))
  }

  const handleEditToggle = () => {
    if (editing) {
      // Cancel edits
      setFormData(profile)
    }
    setEditing(!editing)
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8080/freelancer-api/freelancers/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        throw new Error("Failed to save profile")
      }
      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      setFormData(updatedProfile)
      setEditing(false)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      })
    }
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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>My Profile</span>
            <Button
              variant={editing ? "outline" : "default"}
              size="sm"
              onClick={handleEditToggle}
              aria-label={editing ? "Cancel editing" : "Edit profile"}
              className="flex items-center gap-2"
            >
              {editing ? <X size={16} /> : <Edit size={16} />}
              {editing ? "Cancel" : "Edit"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <div className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!editing}
                  placeholder="Your full name"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!editing}
                  placeholder="Your email address"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!editing}
                  placeholder="Your location"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={formData.skills.join(", ")}
                  onChange={handleInputChange}
                  disabled={!editing}
                  placeholder="e.g. JavaScript, React, Node.js"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  disabled={!editing}
                  placeholder="Describe your experience"
                  rows={4}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="portfolio">Portfolio URL</Label>
                <Input
                  id="portfolio"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  disabled={!editing}
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin size={16} />
                  <span>{profile.location || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star size={16} />
                  <span>{profile.rating?.toFixed(1) ?? "N/A"}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users size={16} />
                  <span>{profile.completedJobs ?? "N/A"} jobs</span>
                </div>
              </div>
              {editing && (
                <Button className="mt-6" onClick={handleSave} size="sm" variant="default" leftIcon={<Save size={16} />}>
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
