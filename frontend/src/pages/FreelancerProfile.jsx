import React from 'react';

const FreelancerProfile = () => {
  const currentFreelancer = {
    "_id": "67b76222261b0e2d253fa130",
    "name": "Devendra Yalamaddi",
    "email": "dev@gmail.com",
    "password": "$2b$10$pql3fKWnIdAulFisJwRA3OMoi3amg6ac89dOYt0MqHUakv8iobB9i",
    "certifications": [
      "certificate-1",
      "certificate-2"
    ],
    "subscriptionStatus": true,
    "subscriptionId": {
      "_id": "67b5d63d6ea3454876456d3b",
      "planType": "pro",
      "features": [
        "20 job applications per week",
        "Unlimited team-based gig access",
        "Advanced profile verification badge",
        "3% service fee on earnings",
        "Access to mentorship from top-rated freelancers",
        "Portfolio & Resume Builder",
        "Discounted access to skill-based certifications",
        "Priority customer support"
      ],
      "price": 499,
      "isOneTime": false,
      "duration": 30,
      "for": "freelancer"
    },
    "subscriptionDurationInDays": 30,
    "balance": 0,
    "skills": [
      "MERN",
      "NextJS",
      "C++"
    ],
    "experience": "3 years",
    "reportedCount": 0,
    "role": "freelancer",
    "createdAt": "2025-02-20T17:10:58.582Z",
    "updatedAt": "2025-02-20T17:23:23.528Z",
    "__v": 0
  };

  return (
    <div className="bg-background  min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-card p-6 rounded-lg ">
        <h1 className="text-3xl font-bold text-primary mb-4">Freelancer Profile</h1>
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Personal Information</h2>
          <p className="text-text-secondary">Name: {currentFreelancer.name}</p>
          <p className="text-text-secondary">Email: {currentFreelancer.email}</p>
          <p className="text-text-secondary">Experience: {currentFreelancer.experience}</p>
        </div>
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Skills</h2>
          <ul className="list-disc list-inside text-text-secondary">
            {currentFreelancer.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Certifications</h2>
          <ul className="list-disc list-inside text-text-secondary">
            {currentFreelancer.certifications.map((certification, index) => (
              <li key={index}>{certification}</li>
            ))}
          </ul>
        </div>
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Subscription Details</h2>
          <p className="text-text-secondary">Plan Type: {currentFreelancer.subscriptionId.planType}</p>
          <p className="text-text-secondary">Price: ${currentFreelancer.subscriptionId.price}</p>
          <p className="text-text-secondary">Duration: {currentFreelancer.subscriptionId.duration} days</p>
          <h3 className="text-lg font-semibold text-text-primary mt-2">Features:</h3>
          <ul className="list-disc list-inside text-text-secondary">
            {currentFreelancer.subscriptionId.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Account Details</h2>
          <p className="text-text-secondary">Balance: ${currentFreelancer.balance}</p>
          <p className="text-text-secondary">Reported Count: {currentFreelancer.reportedCount}</p>
          <p className="text-text-secondary">Role: {currentFreelancer.role}</p>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;