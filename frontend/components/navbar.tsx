"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/context/auth-context"
import { User, Briefcase, LogOut, Menu, X, Home, Search, Bell, MessageSquare, Users, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Skip rendering on login and register pages
  if (pathname.includes("/auth/")) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const isFreelancer = user?.role === "freelancer"
  const dashboardPath = isFreelancer ? "/freelancer/dashboard" : "/client/dashboard"
  const profilePath = isFreelancer ? "/freelancer/profile" : "/client/profile"
  const subscriptionPath = isFreelancer ? "/freelancer/subscriptions" : "/client/subscriptions"

  const router = useRouter();

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1 rounded">
              <Briefcase size={20} />
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">HustleHub</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="mx-6 hidden items-center space-x-4 lg:space-x-6 md:flex">
          {isAuthenticated() ? (
            <>
              <Link
                href={dashboardPath}
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes("dashboard") ? "text-primary" : "text-muted-foreground"}`}
              >
                Dashboard
              </Link>
              {isFreelancer ? (
                <>
                  <Link
                    href="/freelancer/jobs"
                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes("/jobs") ? "text-primary" : "text-muted-foreground"}`}
                  >
                    Find Jobs
                  </Link>
                  <Link
                    href="/freelancer/gigs"
                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes("/gigs") ? "text-primary" : "text-muted-foreground"}`}
                  >
                    My Gigs
                  </Link>
                  <Link
                    href="/freelancer/teams"
                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes("/teams") ? "text-primary" : "text-muted-foreground"}`}
                  >
                    Teams
                  </Link>
                  <Link
                    href={subscriptionPath}
                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes("/subscriptions") ? "text-primary" : "text-muted-foreground"}`}
                  >
                    Subscription
                  </Link>
                  <Link
                    href="/freelancer/clients"
                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes("/subscriptions") ? "text-primary" : "text-muted-foreground"}`}
                  >
                    Find Clients
                  </Link>
                  <Link
                    href="/freelancer/freelancers"
                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes("/subscriptions") ? "text-primary" : "text-muted-foreground"}`}
                  >
                    Find Freelancers
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/client/post-job"
                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes("/post-job") ? "text-primary" : "text-muted-foreground"}`}
                  >
                    Post Job
                  </Link>
                  <Link
                    href="/client/my-jobs"
                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes("/my-jobs") ? "text-primary" : "text-muted-foreground"}`}
                  >
                    My Jobs
                  </Link>
                  <Link
                    href="/client/freelancers"
                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes("/freelancers") ? "text-primary" : "text-muted-foreground"}`}
                  >
                    Find Freelancers
                  </Link>
                  <Link
                    href={subscriptionPath}
                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes("/subscriptions") ? "text-primary" : "text-muted-foreground"}`}
                  >
                    Subscription
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link
                href="/#features"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                How It Works
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {isAuthenticated() ? (
            <>
              {/* <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                  2
                </span>
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare size={20} />
              </Button> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={profilePath}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={dashboardPath}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={()=>{
                    logout()
                    router.push("/auth/login")
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hidden md:block">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register" className="hidden md:block">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden overflow-hidden"
          >
            <div className="space-y-4 px-4 py-4 pb-6 border-b">
              {isAuthenticated() ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href={dashboardPath}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2"
                  >
                    <Home size={16} />
                    Dashboard
                  </Link>
                  {isFreelancer ? (
                    <>
                      <Link
                        href="/freelancer/jobs"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2"
                      >
                        <Search size={16} />
                        Find Jobs
                      </Link>
                      <Link
                        href="/freelancer/gigs"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2"
                      >
                        <Briefcase size={16} />
                        My Gigs
                      </Link>
                      <Link
                        href="/freelancer/teams"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2"
                      >
                        <Users size={16} />
                        Teams
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/client/post-job"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2"
                      >
                        <Plus size={16} />
                        Post Job
                      </Link>
                      <Link
                        href="/client/my-jobs"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2"
                      >
                        <Briefcase size={16} />
                        My Jobs
                      </Link>
                      <Link
                        href="/client/freelancers"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2"
                      >
                        <Search size={16} />
                        Find Freelancers
                      </Link>
                    </>
                  )}
                  <Link
                    href={profilePath}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2"
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 w-full justify-start p-2 h-auto"
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/#features"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2"
                  >
                    Features
                  </Link>
                  <Link
                    href="/#how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2"
                  >
                    How It Works
                  </Link>
                  <div className="flex flex-col gap-2 pt-2">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
