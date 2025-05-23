"use client"

import { toast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
  companyName: string
  industry: string
  contactInfo: string
  // password: string
  certifications: string[]
}

export default function ClientProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    role: "",
    companyName: "",
    industry: "",
    contactInfo: "",
    // password: "",
    certifications: [],
  })
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        setClientId(parsed.id || null);
      }
    }
  }, []);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/client-api/clients/${clientId}`, {
          method: "GET",
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
  
        const data = await response.json();
        data.password=undefined
        setUser(data);
        setFormData({ ...data });
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };
  
    fetchUser();
  }, []);
  

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCertificationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const certifications = value.split(",").map(cert => cert.trim()).filter(Boolean)
    setFormData(prev => ({ ...prev, certifications }))
  }

  const handleSave = async() => {
    try{
      const updatedUser = { ...user, ...formData }
      const tk=localStorage.getItem("token")
      const resUser = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/client-api/clients/${clientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tk}`,
        },
        body: JSON.stringify(updatedUser),
      });
      if(!resUser) {
        throw new Error("Failed to update user");
      }
      setUser(updatedUser as User)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setIsEditing(false)
    }catch(err){
      console.log("Error saving user:", err)
      setIsEditing(true)
    }
  }

  const handleDelete = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-destructive text-lg font-medium">No user data found.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-6 py-10">
      <div className="bg-card text-card-foreground shadow-md rounded-2xl p-6 border border-border">
        <h1 className="text-3xl font-bold mb-6 text-center">Client Profile</h1>

        <div className="space-y-5 mb-6">
          {isEditing ? (
            <>
              <EditableField label="Name" name="name" value={formData.name} onChange={handleEditChange} />
              <EditableField label="Email" name="email" value={formData.email} onChange={handleEditChange} />
              <EditableField label="Role" name="role" value={formData.role} onChange={handleEditChange} />
              <EditableField label="Company Name" name="companyName" value={formData.companyName} onChange={handleEditChange} />
              <EditableField label="Industry" name="industry" value={formData.industry} onChange={handleEditChange} />
              <EditableField label="Contact Info" name="contactInfo" value={formData.contactInfo} onChange={handleEditChange} />
              {/* <EditableField label="Password" name="password" value={formData.password} onChange={handleEditChange} type="password" /> */}
              <EditableTextarea label="Certifications (comma separated)" name="certifications" value={formData.certifications.join(", ")} onChange={handleCertificationsChange} />
            </>
          ) : (
            <>
              <ProfileField label="Name" value={user.name} />
              <ProfileField label="Email" value={user.email} />
              <ProfileField label="Role" value={user.role} capitalize />
              <ProfileField label="Company Name" value={user.companyName} />
              <ProfileField label="Industry" value={user.industry} />
              <ProfileField label="Contact Info" value={user.contactInfo} />
              {/* <ProfileField label="Password" value={user.password} /> */}
              <ProfileField label="Certifications" value={user.certifications?.join(", ")} />
            </>
          )}
        </div>

        <div className="flex justify-between items-center gap-4">
          {isEditing ? (
            <button className="bg-primary text-white px-4 py-2 rounded-xl w-full" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="bg-muted text-foreground px-4 py-2 rounded-xl w-full" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
          <button className="bg-destructive text-white px-4 py-2 rounded-xl w-full" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function ProfileField({ label, value, capitalize = false }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{label}</h2>
      <p className={`text-lg font-semibold ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  )
}

function EditableField({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide block mb-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border border-border bg-background text-foreground px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}

function EditableTextarea({
  label,
  name,
  value,
  onChange,
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide block mb-1">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full border border-border bg-background text-foreground px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary resize-none"
      />
    </div>
  )
}
