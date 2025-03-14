import React,{useState} from "react";
import PostGigForm from "../components/PostGigForm";

const mockData = [
  {
    _id: "67b75ea7ce2c05b5a4094176",
    title: "Web Development - Updated",
    description: "Develop a responsive e-commerce website.",
    clientId: {
      _id: "67b75904b5da604dfe41b060",
      name: "Dev-Client",
      companyName: "Company Dev",
      industry: "E-commerce",
      contactInfo: "contact@company.dev.in",
      email: "dev@client.com",
      subscriptionStatus: true,
    },
    freelancers: [
      "67b76222261b0e2d253fa130",
      "67b76222261b0e2d253fa130",
      "67b76222261b0e2d253fa130",
      "67b76222261b0e2d253fa130",
    ],
    budget: 5000,
    type: "online",
    status: "in-progress",
    milestones: [
      "67b75ea8ce2c05b5a4094179",
      "67b75ea8ce2c05b5a409417a",
      "67b75ea8ce2c05b5a409417b",
    ],
  },
];

function FreelancerHome() {
  const [showGigForm, setShowGigForm] = useState(false);
  return (
    <div className="p-6 bg-[var(--background)] min-h-screen">
      {mockData.map((job) => (
        <div key={job._id} className="bg-[var(--card)] shadow-md rounded-lg p-6 mb-6">
          {/* Job Details */}
          <h2 className="text-2xl font-semibold text-[var(--primary)]">{job.title}</h2>
          <p className="text-[var(--text-secondary)] mt-2">{job.description}</p>

          {/* Client Details */}
          <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Client Details</h3>
            <p className="text-[var(--text-secondary)]">
              <strong>Name:</strong> {job.clientId.name}
            </p>
            <p className="text-[var(--text-secondary)]">
              <strong>Email:</strong> {job.clientId.email}
            </p>
            <p className="text-[var(--text-secondary)]">
              <strong>Company:</strong> {job.clientId.companyName} ({job.clientId.industry})
            </p>
            <p className="text-[var(--text-secondary)]">
              <strong>Subscription:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-white ${job.clientId.subscriptionStatus ? "bg-[var(--success)]" : "bg-[var(--error)]"}`}
              >
                {job.clientId.subscriptionStatus ? "Active" : "Inactive"}
              </span>
            </p>
            {/* Post a Gig Button */}
          <button
            className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-700"
            onClick={() => setShowGigForm(true)}
          >
            Post a Gig
          </button>
          </div>

          {/* Job Info */}
          <div className="mt-4 border-t pt-4 flex justify-between text-[var(--text-primary)]">
            <p>
              <strong>Budget:</strong> ${job.budget}
            </p>
            <p>
              <strong>Type:</strong> {job.type}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-white ${job.status === "in-progress" ? "bg-yellow-500" : "bg-[var(--success)]"}`}
              >
                {job.status}
              </span>
            </p>
          </div>

          {/* Additional Details */}
          <div className="mt-4 border-t pt-4 flex justify-between text-[var(--text-primary)]">
            <p>
              <strong>Freelancers Assigned:</strong> {job.freelancers.length}
            </p>
            <p>
              <strong>Milestones:</strong> {job.milestones.length}
            </p>
          </div>
        </div>
      ))}
      {showGigForm && <PostGigForm onClose={() => setShowGigForm(false)} />}
    </div>
  );
}

export default FreelancerHome;
