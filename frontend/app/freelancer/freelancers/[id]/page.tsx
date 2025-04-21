"use client"

import { useState, useEffect } from "react"
import { MapPin, Star, Users, Mail, Link as LinkIcon, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

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

interface PageProps {
  params: {
    id: string
  }
}

export default function FreelancerProfilePage({ params }: PageProps) {
  const { id } = params
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null)

  useEffect(() => {
    async function fetchFreelancer() {
      try {
        const response = await fetch(`/api/freelancer-api/freelancers/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch freelancer")
        }
        const data = await response.json()
        setFreelancer(data)
      } catch (error) {
        toast.error("Failed to load freelancer profile")
      } finally {
        setLoading(false)
      }
    }
    fetchFreelancer()
  }, [id, toast])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
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

  if (!freelancer) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Freelancer not found.</p>
        <Link href="/freelancer/freelancers" className="text-primary underline mt-4 inline-block">
          Back to Freelancers
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/freelancer/freelancers"
        className="inline-flex items-center gap-2 mb-6 text-primary hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Freelancers
      </Link>

      <div className="bg-card border border-border shadow-sm rounded-2xl p-6 text-foreground">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
          <div className="flex items-center justify-center bg-muted text-muted-foreground rounded-full h-20 w-20 text-3xl font-bold">
            {getInitials(freelancer.name)}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">{freelancer.name}</h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2 text-sm text-muted-foreground">
              {freelancer.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{freelancer.location}</span>
                </div>
              )}
              {freelancer.rating !== undefined && (
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400" />
                  <span>{freelancer.rating.toFixed(1)}</span>
                </div>
              )}
              {freelancer.completedJobs !== undefined && (
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{freelancer.completedJobs} jobs</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail size={16} />
            <a
              href={`mailto:${freelancer.email}`}
              className="underline hover:text-primary transition-colors"
            >
              {freelancer.email}
            </a>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {freelancer.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full border border-border"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Experience</h2>
          <p className="text-muted-foreground whitespace-pre-line">{freelancer.experience}</p>
        </section>

        {freelancer.portfolio && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Portfolio</h2>
            <a
              href={freelancer.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline break-all flex items-center gap-1 hover:text-primary/80 transition"
            >
              <LinkIcon size={16} />
              {freelancer.portfolio}
            </a>
          </section>
        )}

        <div className="pt-4 border-t border-border">
          <a
            href={`mailto:${freelancer.email}`}
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg mt-4 hover:bg-primary/90 transition"
          >
            Contact Freelancer
          </a>
        </div>
      </div>
    </div>
  )
}
