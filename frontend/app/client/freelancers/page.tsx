"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, Star, MapPin, ArrowRight, X, Users } from "lucide-react"

interface Freelancer {
  _id: string
  name: string
  email: string
  skills: string[]
  experience: string
  portfolio?: string
  location?: string
  rating?: number
  completedJobs?: number
}

export default function ClientFreelancers() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [filteredFreelancers, setFilteredFreelancers] = useState<Freelancer[]>([])

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [skillFilter, setSkillFilter] = useState<string | null>(null)
  const [locationFilter, setLocationFilter] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      fetchFreelancers().finally(() => {
        setLoading(false)
      })
    }
  }, [token])

  useEffect(() => {
    // Apply filters when freelancers or search term change
    let result = [...freelancers]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (freelancer) =>
          freelancer.name.toLowerCase().includes(term) ||
          freelancer.skills.some((skill) => skill.toLowerCase().includes(term)) ||
          (freelancer.experience && freelancer.experience.toLowerCase().includes(term)),
      )
    }

    if (skillFilter) {
      result = result.filter((freelancer) =>
        freelancer.skills.some((skill) => skill.toLowerCase() === skillFilter.toLowerCase()),
      )
    }

    if (locationFilter) {
      result = result.filter(
        (freelancer) => freelancer.location && freelancer.location.toLowerCase() === locationFilter.toLowerCase(),
      )
    }

    setFilteredFreelancers(result)
  }, [freelancers, searchTerm, skillFilter, locationFilter])

  const fetchFreelancers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/freelancer-api/freelancers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch freelancers")
      }

      const data = await response.json()

      // Add some mock data for demonstration
      const enhancedData = data.map((freelancer: Freelancer) => ({
        ...freelancer,
        location:
          freelancer.location ||
          ["New York", "San Francisco", "Remote", "London", "Berlin"][Math.floor(Math.random() * 5)],
        rating: freelancer.rating || (Math.floor(Math.random() * 10) + 35) / 10, // Random rating between 3.5 and 4.5
        completedJobs: freelancer.completedJobs || Math.floor(Math.random() * 50) + 1, // Random completed jobs between 1 and 50
      }))

      setFreelancers(enhancedData)
      setFilteredFreelancers(enhancedData)
    } catch (error) {
      console.error("Error fetching freelancers:", error)
      toast({
        title: "Error",
        description: "Failed to load freelancers",
        variant: "destructive",
      })
    }
  }

  const inviteToJob = async (freelancerId: string) => {
    try {
      // This would typically open a modal to select a job to invite to
      toast({
        title: "Invite sent",
        description: "The freelancer has been invited to your job",
      })
    } catch (error) {
      console.error("Error inviting freelancer:", error)
      toast({
        title: "Error",
        description: "Failed to invite freelancer",
        variant: "destructive",
      })
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSkillFilter(null)
    setLocationFilter(null)
  }

  // Get unique skills and locations for filters
  const uniqueSkills = Array.from(new Set(freelancers.flatMap((f) => f.skills)))
  const uniqueLocations = Array.from(
    new Set(freelancers.map((f) => f.location).filter((location): location is string => !!location)),
  )

  const getInitials = (name: string) => {
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
            <h1 className="text-3xl font-bold">Find Freelancers</h1>
            <p className="text-muted-foreground">Discover talented professionals for your projects</p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, skills..."
              className="pl-9 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-12">
          {/* Filters Sidebar */}
          <div className="md:col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </CardTitle>
                  {(skillFilter || locationFilter) && (
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSkills.slice(0, 10).map((skill) => (
                      <Badge
                        key={skill}
                        variant={skillFilter === skill ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSkillFilter(skillFilter === skill ? null : skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Location</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueLocations.map((location) => (
                      <Badge
                        key={location}
                        variant={locationFilter === location ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setLocationFilter(locationFilter === location ? null : location)}
                      >
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Freelancer Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Available Freelancers</div>
                  <Badge variant="secondary">{filteredFreelancers.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Freelancers List */}
          <div className="md:col-span-9">
            {filteredFreelancers.length > 0 ? (
              <motion.div variants={containerVariants} className="space-y-4">
                {filteredFreelancers.map((freelancer) => (
                  <motion.div key={freelancer._id} variants={itemVariants}>
                    <Card className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>{getInitials(freelancer.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{freelancer.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                
                                {freelancer.rating && (
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Star size={14} className="mr-1 text-yellow-500" />
                                    {freelancer.rating.toFixed(1)}
                                  </div>
                                )}
                                
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div>
                            <h4 className="text-sm font-medium">Skills:</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {freelancer.skills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Experience:</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{freelancer.experience}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <Button size="sm" variant="outline" onClick={() => inviteToJob(freelancer._id)}>
                          Invite to Job
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/client/freelancers/${freelancer._id}`}>
                            View Profile
                            <ArrowRight size={16} className="ml-2" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card className="py-10">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No freelancers found</h3>
                  <p className="text-muted-foreground max-w-md mt-2">
                    No freelancers match your current filters. Try adjusting your search criteria.
                  </p>
                  <Button className="mt-4" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
