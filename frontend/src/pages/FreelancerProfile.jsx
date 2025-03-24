import React, { useEffect, useState } from 'react';

const FreelancerProfile = () => {
  const [freelancer, setFreelancer] = useState({
    "_id": "67b76222261b0e2d253fa130",
    "name": "Devendra Yalamaddi",
    "email": "dev@gmail.com",
    "password": "$2b$10$pql3fKWnIdAulFisJwRA3OMoi3amg6ac89dOYt0MqHUakv8iobB9i",
    "certifications": ["certificate-1", "certificate-2"],
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
    "skills": ["MERN", "NextJS", "C++"],
    "experience": "3 years",
    "reportedCount": 0,
    "role": "freelancer",
    "createdAt": "2025-02-20T17:10:58.582Z",
    "updatedAt": "2025-02-20T17:23:23.528Z",
    "__v": 0
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: freelancer.name,
    email: freelancer.email,
    experience: freelancer.experience,
    skills: freelancer.skills.join(", "), // Convert array to string for input
    certifications: freelancer.certifications.join(", "),
    planType: freelancer.subscriptionId.planType,
    price: freelancer.subscriptionId.price,
    duration: freelancer.subscriptionId.duration,
    balance: freelancer.balance,
    reportedCount: freelancer.reportedCount,
    role: freelancer.role,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    // Add some basic validation here if needed
    const updatedFreelancer = {
      ...freelancer,
      ...formData,
      skills: formData.skills.split(",").map((skill) => skill.trim()), // Convert string to array
      certifications: formData.certifications.split(",").map((cert) => cert.trim()),
      subscriptionId: {
        ...freelancer.subscriptionId,
        planType: formData.planType,
        price: Number(formData.price),
        duration: Number(formData.duration),
      },
      balance: Number(formData.balance),
      reportedCount: Number(formData.reportedCount),
    };

    // Update the freelancer state
    setFreelancer(updatedFreelancer);
    setEditMode(false);
  };

  useEffect(() => {
    // Only update form data if freelancer data changes
    setFormData({
      name: freelancer.name,
      email: freelancer.email,
      experience: freelancer.experience,
      skills: freelancer.skills.join(", "),
      certifications: freelancer.certifications.join(", "),
      planType: freelancer.subscriptionId.planType,
      price: freelancer.subscriptionId.price,
      duration: freelancer.subscriptionId.duration,
      balance: freelancer.balance,
      reportedCount: freelancer.reportedCount,
      role: freelancer.role,
    });
  }, [freelancer]);

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-card p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-primary mb-6">Freelancer Profile</h1>

        {editMode ? (
          <>
            {/* Personal Information */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-text-primary">Personal Information</h2>
              <label className="block text-text-primary font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-2"
              />

              <label className="block text-text-primary font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-2"
              />

              <label className="block text-text-primary font-semibold">Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-2"
              />
            </div>

            {/* Skills */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-text-primary">Skills</h2>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Enter skills, separated by commas"
              />
            </div>

            {/* Certifications */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-text-primary">Certifications</h2>
              <input
                type="text"
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Enter certifications, separated by commas"
              />
            </div>

            {/* Subscription Details */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-text-primary">Subscription Details</h2>
              <label className="block text-text-primary font-semibold">Plan Type</label>
              <input
                type="text"
                name="planType"
                value={formData.planType}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-2"
              />

              <label className="block text-text-primary font-semibold">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-2"
              />

              <label className="block text-text-primary font-semibold">Duration (days)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-2"
              />
            </div>

            {/* Account Details */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-text-primary">Account Details</h2>
              <label className="block text-text-primary font-semibold">Balance</label>
              <input
                type="number"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-2"
              />

              <label className="block text-text-primary font-semibold">Reported Count</label>
              <input
                type="number"
                name="reportedCount"
                value={formData.reportedCount}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-2"
              />
            </div>

            {/* Buttons */}
            <button className="bg-success text-white px-4 py-2 rounded mr-2" onClick={handleUpdate}>
              Save Changes
            </button>
            <button className="bg-error text-white px-4 py-2 rounded" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-text-primary">Personal Information</h2>
              <p className="text-text-secondary">Name: {freelancer.name}</p>
              <p className="text-text-secondary">Email: {freelancer.email}</p>
              <p className="text-text-secondary">Experience: {freelancer.experience}</p>
            </div>

            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-text-primary">Skills</h2>
              <ul className="list-disc list-inside text-text-secondary">
                {freelancer.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>

            <button className="bg-primary text-white px-4 py-2 rounded mt-4" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FreelancerProfile;
