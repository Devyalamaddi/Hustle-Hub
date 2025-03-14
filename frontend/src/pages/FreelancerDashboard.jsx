import React from 'react'
import FreelancerProfile from './FreelancerProfile'

function FreelancerDashboard() {
  const gigsByFreelancer = [
    {
      "_id": "67b7633d261b0e2d253fa13b",
      "jobID": {
        "_id": "67b75ea7ce2c05b5a4094176",
        "title": "Web Development - Updated",
        "description": "Develop a responsive e-commerce website.",
        "clientId": "67b75904b5da604dfe41b060",
        "freelancers": [
          "67b76222261b0e2d253fa130",
          "67b76222261b0e2d253fa130",
          "67b76222261b0e2d253fa130",
          "67b76222261b0e2d253fa130",
          "67b76222261b0e2d253fa130"
        ],
        "budget": 5000,
        "type": "online",
        "status": "in-progress",
        "milestones": [
          "67b75ea8ce2c05b5a4094179",
          "67b75ea8ce2c05b5a409417a",
          "67b75ea8ce2c05b5a409417b"
        ],
        "teamRequired": true,
        "__v": 1
      },
      "userID": "67b76222261b0e2d253fa130",
      "description": "I can optimise the website",
      "status": "accepted",
      "createdAt": "2025-02-20T17:15:41.727Z",
      "__v": 0
    }
  ];
  return (
    <div className="container mx-auto px-4 py-6 bg-[var(--background-color)]">
      <h1 className="text-4xl md:text-5xl font-bold text-center my-6 text-[var(--text-primary)]">
          Freelancer Dashboard
      </h1>
      <div className="flex justify-evenly gap-3">
        <div className="w-1/3">
          <FreelancerProfile/>
        </div>
        <div className='w-2/3'>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Gigs</h2>
          <div className="bg-[var(--background-color)] rounded-lg p-4">
            {gigsByFreelancer.map((gig, index) => (
              <div key={index} className="p-4 my-2 bg-[var(--background-secondary)] rounded-lg">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">{gig.jobID.title}</h3>
                <p className="text-[var(--text-secondary)]">{gig.jobID.description}</p>
                <p className="text-[var(--text-secondary)]">Status: {gig.status}</p>
              </div>
            ))}
        </div>
        </div>
      </div>
    </div>
  )
}

export default FreelancerDashboard