// API helper functions to interact with the backend
import { toast } from "@/components/ui/use-toast"

// Base fetch function with error handling
export async function fetchApi(endpoint: string, options: RequestInit = {}): Promise<any> {
  try {
    const token = localStorage.getItem("token")

    // Merge headers with auth token if available
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`/api/${endpoint}`, {
      ...options,
      headers,
    })

    // Parse response as JSON
    const data = await response.json()

    // Check if response is not ok
    if (!response.ok) {
      throw new Error(data.error || data.message || "Something went wrong")
    }

    return data
  } catch (error) {
    // Show error toast and rethrow
    toast({
      title: "Error",
      description: error.message || "An error occurred",
      variant: "destructive",
    })
    throw error
  }
}

// API Functions for Freelancers
export const FreelancerAPI = {
  // Authentication
  login: (credentials: { email: string; password: string }) =>
    fetchApi("freelancer-api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData: any) =>
    fetchApi("freelancer-api/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // Profile management
  getProfile: (id: string) => fetchApi(`freelancer-api/freelancers/${id}`),

  updateProfile: (id: string, data: any) =>
    fetchApi(`freelancer-api/freelancers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Jobs and gigs
  getJobs: () => fetchApi("freelancer-api/job-posts"),

  getGigs: () => fetchApi("freelancer-api/gigs"),

  createGig: (data: { jobID: string; description: string }) =>
    fetchApi("freelancer-api/gigs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Teams
  getTeamInvitations: () => fetchApi("freelancer-api/team-invitations"),

  acceptTeamInvitation: (teamID: string) =>
    fetchApi(`freelancer-api/teams/${teamID}/accept-invitation`, {
      method: "POST",
    }),

  rejectTeamInvitation: (teamID: string) =>
    fetchApi(`freelancer-api/teams/${teamID}/reject-invitation`, {
      method: "POST",
    }),

  // Subscriptions
  getSubscriptionPlans: () => fetchApi("freelancer-api/subscriptions"),

  buySubscription: (subscriptionPlanID: string) =>
    fetchApi(`freelancer-api/buy-subscription/${subscriptionPlanID}`, {
      method: "POST",
    }),
}

// API Functions for Clients
export const ClientAPI = {
  // Authentication
  login: (credentials: { email: string; password: string }) =>
    fetchApi("client-api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData: any) =>
    fetchApi("client-api/signin", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // Profile management
  getProfile: (id: string) => fetchApi(`client-api/clients/${id}`),

  updateProfile: (id: string, data: any) =>
    fetchApi(`client-api/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Jobs
  getJobs: () => fetchApi("client-api/jobs"),

  getJob: (id: string) => fetchApi(`client-api/jobs/${id}`),

  createJob: (data: any) =>
    fetchApi("client-api/post-job", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateJob: (id: string, data: any) =>
    fetchApi(`client-api/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteJob: (id: string) =>
    fetchApi(`client-api/jobs/${id}`, {
      method: "DELETE",
    }),

  // Gigs
  getGigsForJob: (jobID: string) => fetchApi(`client-api/jobs/${jobID}/gigs`),

  confirmFreelancer: (jobID: string, freelancerID: string) =>
    fetchApi(`client-api/jobs/${jobID}/confirm-gig/${freelancerID}`, {
      method: "POST",
    }),

  // Subscriptions
  getSubscriptionPlans: () => fetchApi("client-api/subscriptions"),

  buySubscription: (subscriptionPlanID: string) =>
    fetchApi(`client-api/buy-subscription/${subscriptionPlanID}`, {
      method: "POST",
    }),
}
