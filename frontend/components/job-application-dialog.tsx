"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Sparkles, Users } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateText } from "ai"
import { createGroq, groq } from "@ai-sdk/groq"
import { ResumeUploadDialog } from "./resume-upload-dialog"

interface Team {
  _id: string
  name: string
}

interface JobApplicationDialogProps {
  isOpen: boolean
  onClose: () => void
  jobId: string
  jobTitle: string
  jobDescription?: string
  onSuccess: () => void
}

const applicationSchema = z.object({
  description: z.string().min(20, "Description must be at least 20 characters"),
  teamId: z.string().optional(),
})
const groqWithKey = createGroq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export function JobApplicationDialog({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  jobDescription = "",
  onSuccess,
}: JobApplicationDialogProps) {
  let { token, user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [loadingTeams, setLoadingTeams] = useState(false)
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      description: "",
      teamId: undefined,
    },
  })

  const storedUser = localStorage.getItem("user");
  user = storedUser ? JSON.parse(storedUser) : null;

  // Fetch teams when dialog opens
  const fetchTeams = async () => {
    if (!isOpen) return

    setLoadingTeams(true)
    try {
      const response = await fetch("http://localhost:8080/freelancer-api/teams", {
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
    } finally {
      setLoadingTeams(false)
    }
  }

  // Call fetchTeams when dialog opens
  if (isOpen && teams.length === 0 && !loadingTeams) {
    fetchTeams()
  }

  const onSubmit = async (values: z.infer<typeof applicationSchema>) => {
    setIsSubmitting(true)
    try {
      // If teamId is provided, apply as a team
      if (values.teamId && values.teamId !== "individual") {
        console.log(jobId);
        const response = await fetch(`http://localhost:8080/freelancer-api/jobs/${jobId}/apply-as-team/${values.teamId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: values.description,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to apply for job as a team")
        }
      } else {
        // Apply as an individual
        const response = await fetch("http://localhost:8080/freelancer-api/gigs", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobID: jobId,
            description: values.description,
          }),
        })

        if(response.status === 409){
          toast({
            title: "Already Applied",
            description: "Your application has been already successfully submitted",
          })
          return
        }

        if (!response.ok) {
          throw new Error("Failed to apply for job")
        }
      }

      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted",
      })

      onSuccess()
      onClose()
      form.reset()
    } catch (error) {
      console.error("Error applying for job:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAISuggestionClick = () => {
    setIsResumeDialogOpen(true)
  }

  const generateAIDescription = async (resumeText?: string) => {
    setIsGenerating(true)
    try {
      // Use Groq AI to generate a job application description
      const userSkills = user?.skills?.join(", ") || "various skills"
      const userExperience = user?.experience || "professional experience"

      let prompt = `
        Write a professional job application for the position "${jobTitle}".
        
        Job Description: ${jobDescription || "A job requiring professional skills and experience"}
        
        My Skills: ${userSkills}
        My Experience: ${userExperience}
      `

      // If resume text is provided, include it in the prompt
      if (resumeText) {
        prompt += `
        
        My Resume:
        ${resumeText}
        `
      }

      prompt += `
        
        Write a compelling application that highlights my relevant skills and experience for this position.
        Keep it professional, concise (150-200 words), and persuasive.
        Focus on why I'm a good fit for this specific job.
        Do not use generic phrases like "I am writing to apply".
        Start directly with relevant qualifications.
        Tailor the application specifically to the job description provided.
        Donot provide your response like "Here is your..." or "Here is the application...".
        Just provide the application text.
      `

      const systemPrompt = resumeText
        ? "You are an expert career advisor who helps professionals write compelling job applications. Your task is to create a professional, concise, and persuasive job application that highlights the candidate's relevant skills and experience from their resume, tailored specifically to the job description."
        : "You are an expert career advisor who helps professionals write compelling job applications. Your task is to create a professional, concise, and persuasive job application that highlights the candidate's relevant skills and experience."

      const { text } = await generateText({
        model: groqWithKey("llama3-70b-8192"),
        prompt: prompt,
        system: systemPrompt,
        maxTokens: 500,
      })

      form.setValue("description", text)

      toast({
        title: resumeText ? "Resume-based suggestion generated" : "AI suggestion generated",
        description: resumeText
          ? "A personalized description has been generated based on your resume and the job details"
          : "A description has been generated based on your profile and the job details",
      })
    } catch (error) {
      console.error("Error generating AI description:", error)

      // Fallback if AI generation fails
      const fallbackDescription = `I am excited to apply for the "${jobTitle}" position. With my experience in ${user?.skills?.join(", ") || "relevant skills"}, I believe I can deliver exceptional results for this project. I have successfully completed similar projects in the past and am confident in my ability to meet your requirements efficiently and effectively. I look forward to discussing how my expertise aligns with your project needs.`

      form.setValue("description", fallbackDescription)

      toast({
        title: "Using fallback suggestion",
        description:
          "We couldn't connect to our AI service, but we've generated a basic template for you to customize.",
        variant: "default",
      })
    } finally {
      setIsGenerating(false)
      setIsResumeDialogOpen(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply for Job: {jobTitle}</DialogTitle>
            <DialogDescription>
              Submit your application for this job. Write a compelling description to increase your chances of being
              selected.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Description</FormLabel>
                    <div className="flex items-center justify-between">
                      <FormDescription>Describe why you're a good fit for this job</FormDescription>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAISuggestionClick}
                        disabled={isGenerating}
                        className="h-8"
                      >
                        {isGenerating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        AI Suggestion
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Write your application description here..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {teams.length > 0 && (
                <FormField
                  control={form.control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apply as Team (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a team (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="individual">Apply as Individual</SelectItem>
                          {teams.map((team) => (
                            <SelectItem key={team._id} value={team._id}>
                              <div className="flex items-center">
                                <Users className="mr-2 h-4 w-4" />
                                {team.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>You can apply as an individual or as part of a team</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Resume Upload Dialog */}
      <ResumeUploadDialog
        isOpen={isResumeDialogOpen}
        onClose={() => setIsResumeDialogOpen(false)}
        onUpload={(resumeText) => generateAIDescription(resumeText)}
        onContinueWithoutResume={() => generateAIDescription()}
      />
    </>
  )
}
// "use client"

// import { useState } from "react"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { Loader2, Sparkles, Users } from "lucide-react"
// import { useAuth } from "@/context/auth-context"
// import { useToast } from "@/components/ui/use-toast"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { generateText } from "ai"
// import { groq } from "@ai-sdk/groq"

// interface Team {
//   _id: string
//   name: string
// }

// interface JobApplicationDialogProps {
//   isOpen: boolean
//   onClose: () => void
//   jobId: string
//   jobTitle: string
//   jobDescription?: string
//   onSuccess: () => void
// }

// const applicationSchema = z.object({
//   description: z.string().min(20, "Description must be at least 20 characters"),
//   teamId: z.string().optional(),
// })

// export function JobApplicationDialog({
//   isOpen,
//   onClose,
//   jobId,
//   jobTitle,
//   jobDescription = "",
//   onSuccess,
// }: JobApplicationDialogProps) {
//   const { token, user } = useAuth()
//   const { toast } = useToast()
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [teams, setTeams] = useState<Team[]>([])
//   const [loadingTeams, setLoadingTeams] = useState(false)

//   const form = useForm<z.infer<typeof applicationSchema>>({
//     resolver: zodResolver(applicationSchema),
//     defaultValues: {
//       description: "",
//       teamId: undefined,
//     },
//   })

//   // Fetch teams when dialog opens
//   const fetchTeams = async () => {
//     if (!isOpen) return

//     setLoadingTeams(true)
//     try {
//       const response = await fetch("/api/freelancer-api/teams", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       if (!response.ok) {
//         throw new Error("Failed to fetch teams")
//       }

//       const data = await response.json()
//       setTeams(data)
//     } catch (error) {
//       console.error("Error fetching teams:", error)
//     } finally {
//       setLoadingTeams(false)
//     }
//   }

//   // Call fetchTeams when dialog opens
//   if (isOpen && teams.length === 0 && !loadingTeams) {
//     fetchTeams()
//   }

//   const onSubmit = async (values: z.infer<typeof applicationSchema>) => {
//     setIsSubmitting(true)
//     try {
//       // If teamId is provided, apply as a team
//       console.log(values.teamId)
//       if (values.teamId && values.teamId !== "individual") {
//         const response = await fetch(`/api/freelancer-api/jobs/${jobId}/apply-as-team/${values.teamId}`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             description: values.description,
//           }),
//         })

//         if (!response.ok) {
//           throw new Error("Failed to apply for job as a team")
//         }
//       } else {
//         // Apply as an individual
       
//         const response = await fetch("/api/freelancer-api/gigs", {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             jobID: jobId,
//             description: values.description,
//           }),
//         })

//         console.log(response.status)

//         if(response.status === 409){
//           toast({
//             title: "Already Applied",
//             description: "Your application has been already successfully submitted",
//           })
//           return
//         }

//         if (!response.ok) {
//           throw new Error("Failed to apply for job")
//         }
//       }

//       toast({
//         title: "Application submitted",
//         description: "Your application has been successfully submitted",
//       })

//       onSuccess()
//       onClose()
//       form.reset()
//     } catch (error) {
//       console.error("Error applying for job:", error)
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to submit application",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const generateAIDescription = async () => {
//     setIsGenerating(true)
//     try {
//       // Use Groq AI to generate a job application description
//       const userSkills = user?.skills?.join(", ") || "various skills"
//       const userExperience = user?.experience || "professional experience"

//       const prompt = `
//       Write a professional job application for the position "${jobTitle}".
      
//       Job Description: ${jobDescription || "A job requiring professional skills and experience"}
      
//       My Skills: ${userSkills}
//       My Experience: ${userExperience}
      
//       Write a compelling application that highlights my relevant skills and experience for this position.
//       Keep it professional, concise (150-200 words), and persuasive.
//       Focus on why I'm a good fit for this specific job.
//       Do not use generic phrases like "I am writing to apply".
//       Start directly with relevant qualifications.
//     `

//       const { text } = await generateText({
//         model: groq("llama3-70b-8192"),
//         prompt: prompt,
//         system:
//           "You are an expert career advisor who helps professionals write compelling job applications. Your task is to create a professional, concise, and persuasive job application that highlights the candidate's relevant skills and experience.",
//         maxTokens: 500,
//       })

//       form.setValue("description", text)

//       toast({
//         title: "AI suggestion generated",
//         description: "A description has been generated based on your profile and the job details",
//       })
//     } catch (error) {
//       console.error("Error generating AI description:", error)

//       // Fallback if AI generation fails
//       const fallbackDescription = `I am excited to apply for the "${jobTitle}" position. With my experience in ${user?.skills?.join(", ") || "relevant skills"}, I believe I can deliver exceptional results for this project. I have successfully completed similar projects in the past and am confident in my ability to meet your requirements efficiently and effectively. I look forward to discussing how my expertise aligns with your project needs.`

//       form.setValue("description", fallbackDescription)

//       toast({
//         title: "Using fallback suggestion",
//         description:
//           "We couldn't connect to our AI service, but we've generated a basic template for you to customize.",
//         variant: "default",
//       })
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Apply for Job: {jobTitle}</DialogTitle>
//           <DialogDescription>
//             Submit your application for this job. Write a compelling description to increase your chances of being
//             selected.
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Application Description</FormLabel>
//                   <div className="flex items-center justify-between">
//                     <FormDescription>Describe why you're a good fit for this job</FormDescription>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={generateAIDescription}
//                       disabled={isGenerating}
//                       className="h-8"
//                     >
//                       {isGenerating ? (
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       ) : (
//                         <Sparkles className="mr-2 h-4 w-4" />
//                       )}
//                       AI Suggestion
//                     </Button>
//                   </div>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Write your application description here..."
//                       className="min-h-[150px]"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {teams.length > 0 && (
//               <FormField
//                 control={form.control}
//                 name="teamId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Apply as Team (Optional)</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a team (optional)" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="individual">Apply as Individual</SelectItem>
//                         {teams.map((team) => (
//                           <SelectItem key={team._id} value={team._id}>
//                             <div className="flex items-center">
//                               <Users className="mr-2 h-4 w-4" />
//                               {team.name}
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormDescription>You can apply as an individual or as part of a team</FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             )}

//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Submitting...
//                   </>
//                 ) : (
//                   "Submit Application"
//                 )}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   )
// }
