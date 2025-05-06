"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: "freelancer" | "client"
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string, role: "freelancer" | "client") => Promise<void>
  register: (userData: any, role: "freelancer" | "client") => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if there's a token in localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }

    setLoading(false)
  }, [])

  const login = async (email: string, password: string, role: "freelancer" | "client") => {
    setLoading(true)
    try {
      const endpoint = role === "freelancer" ? "http://localhost:8080/freelancer-api/login" : "http://localhost:8080/client-api/login"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })


      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Decode token to get user info
      const decodedToken = JSON.parse(atob(data.token.split(".")[1]))
      const userData = decodedToken.data

      setToken(data.token)
      setUser({
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      })

      localStorage.setItem("token", data.token)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        }),
      )

      toast({
        title: "Login successful",
        description: "Welcome back!",
      })

      // Redirect based on role
      if (role === "freelancer") {
        router.push("/freelancer/dashboard")
      } else {
        router.push("/client/dashboard")
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: any, role: "freelancer" | "client") => {
    setLoading(true)
    try {
      const endpoint = role === "freelancer" ? "http://localhost:8080/freelancer-api/signup" : "http://localhost:8080/client-api/signin"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      toast({
        title: "Registration successful",
        description: "Please login with your new account",
      })

      router.push(`/auth/login?role=${role}`)
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  const isAuthenticated = () => {
    return !!token
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
