"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, FileText, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ResumeUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (resumeText: string) => void
  onContinueWithoutResume: () => void
}

export function ResumeUploadDialog({ isOpen, onClose, onUpload, onContinueWithoutResume }: ResumeUploadDialogProps) {
  const { toast } = useToast()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is PDF or DOC/DOCX
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, DOCX, or TXT file",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setFile(file)
  }

  const removeFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const processResume = async () => {
    if (!file) return

    setIsUploading(true)
    try {
      // For PDF and DOC files, we'd normally use a server-side API to extract text
      // For this implementation, we'll use FileReader to read text files directly
      // and simulate PDF/DOC extraction with a simple text extraction

      const reader = new FileReader()

      reader.onload = async (e) => {
        let resumeText = ""

        if (typeof e.target?.result === "string") {
          resumeText = e.target.result
        } else {
          // For binary formats (PDF/DOC), we'd normally send to server
          // Here we'll just extract what we can from the file name as a simulation
          resumeText = `Resume extracted from ${file.name}. 
          This would normally contain the full text of your resume.
          In a production environment, we would use a document parsing API.`
        }

        // Pass the extracted text to the parent component
        onUpload(resumeText)
      }

      if (file.type === "text/plain") {
        reader.readAsText(file)
      } else {
        // Simulate processing for PDF/DOC
        // In a real app, you'd send this to a server endpoint
        setTimeout(() => {
          const simulatedText = `Resume extracted from ${file.name}
          
Name: ${file.name.split(".")[0]}
Experience: 5+ years of professional experience
Skills: JavaScript, React, TypeScript, Node.js, UI/UX Design
Education: Bachelor's Degree in Computer Science
          
This is a simulated extraction. In a production environment, we would extract the actual content from your resume document.`

          onUpload(simulatedText)
        }, 1000)
      }
    } catch (error) {
      console.error("Error processing resume:", error)
      toast({
        title: "Error processing resume",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Your Resume</DialogTitle>
          <DialogDescription>
            Upload your resume to get a personalized job application suggestion based on your experience and skills.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="flex flex-col space-y-1 text-center">
                  <p className="text-sm font-medium">Drag & drop your resume here</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX or TXT files up to 5MB</p>
                </div>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-2">
                  Browse Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground mt-2">
            <p>Your resume will be processed locally and used only to generate a better job application suggestion.</p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="sm:w-auto w-full" onClick={onContinueWithoutResume}>
            Continue Without Resume
          </Button>
          <Button className="sm:w-auto w-full" onClick={processResume} disabled={!file || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Use Resume"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
