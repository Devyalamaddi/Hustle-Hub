"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Loader2, Plus, Trash } from "lucide-react"

const milestoneSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  dueDate: z.string().refine((val) => {
    const date = new Date(val)
    return date > new Date()
  }, "Due date must be in the future"),
})

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  budget: z.coerce.number().min(10, "Budget must be at least $10"),
  type: z.enum(["online", "offline"]),
  teamRequired: z.boolean(),
  milestones: z.array(milestoneSchema).optional(),
})

export default function EditJobPage() {
  const { token } = useAuth()
  const router = useRouter()
  const params = useParams()
  const jobId = params.id
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: 0,
      type: "online",
      teamRequired: false,
      milestones: [
        {
          title: "",
          description: "",
          amount: 0,
          dueDate: "",
        },
      ],
    },
  })

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "milestones",
  })

  useEffect(() => {
    async function fetchJob() {
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:8080/client-api/jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch job details")
        }
        const data = await response.json()

        // Map fetched data to form default values
        form.reset({
          title: data.title || "",
          description: data.description || "",
          budget: data.budget ?? 0,
          type: data.type || "online",
          teamRequired: data.teamRequired ?? false,
          milestones: data.milestones && data.milestones.length > 0 ? data.milestones.map((m: any) => ({
            title: m.title || "",
            description: m.description || "",
            amount: m.amount ?? 0,
            dueDate: m.dueDate ? m.dueDate.split("T")[0] : "", // format date as yyyy-mm-dd
          })) : [
            {
              title: "",
              description: "",
              amount: 0,
              dueDate: "",
            },
          ],
        })
      } catch (error) {
        console.error("Error fetching job details:", error)
        toast({
          title: "Error",
          description: "Failed to load job details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (jobId && token) {
      fetchJob()
    }
  }, [jobId, token])

  const onSubmit: import("react-hook-form").SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`http://localhost:8080/client-api/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to update job")
      }

      toast({
        title: "Job updated successfully",
        description: "Your job posting has been updated",
      })

      router.push("/client/my-jobs")
    } catch (error) {
      console.error("Error updating job:", error)
      toast({
        title: "Error",
        description: "Failed to update job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
        <p className="mt-4 text-lg">Loading job details...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold">Edit Job</h1>
          <p className="text-muted-foreground mt-2">
            Update the details of your job posting
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                  <CardDescription>
                    Provide information about your project to attract the right freelancers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Website Development" {...field} />
                        </FormControl>
                        <FormDescription>A clear title will help freelancers understand your project</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your project in detail..."
                            {...field}
                            className="min-h-[120px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Include skills required, deliverables, and timeline expectations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} placeholder="e.g. 500" {...field} value={field.value ?? ""} />
                          </FormControl>
                          <FormDescription>Total budget for the project</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select job type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="online">Online</SelectItem>
                              <SelectItem value="offline">Offline</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Work location requirement</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="teamRequired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Team Required</FormLabel>
                          <FormDescription>Is this project suitable for a team of freelancers?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Milestones</CardTitle>
                  <CardDescription>Break down your project into manageable milestones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="absolute right-2 top-2"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>

                      <h3 className="font-medium">Milestone {index + 1}</h3>

                      <FormField
                        control={form.control}
                        name={`milestones.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Initial Design" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`milestones.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe the deliverables for this milestone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`milestones.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount ($)</FormLabel>
                              <FormControl>
                                <Input type="number" min={1} placeholder="e.g. 100" {...field} value={field.value ?? ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`milestones.${index}.dueDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Due Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      append({
                        title: "",
                        description: "",
                        amount: 0,
                        dueDate: "",
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Milestone
                  </Button>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Job"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </motion.div>
      </motion.div>
    </div>
  )
}
