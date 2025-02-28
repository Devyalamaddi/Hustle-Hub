import React, { useState } from 'react';
import ClientProfile from './ClientProfile';
import './ClientDashboard.css'

function ClientDashboard() {
  const [isJobDetails, setIsJobDetails] = useState(null); 
  const [showMilestones, setShowMilestones] = useState(false);
  const [showFreelancers, setShowFreelancers] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null); 
  const [postingNewJob, setPostingNewJob] = useState(false);
  const [step, setStep] = useState(1); 
  const [numMilestones, setNumMilestones] = useState(0);  
  const [milestones, setMilestones] = useState([]); 
  
  // Use state for jobs
  const [jobsByClient, setJobsByClient] = useState([
      {
        "_id": "67b78ea7de2c05b5a4094276",
        "title": "Mobile App Development",
        "description": "Develop a cross-platform mobile application.",
        "clientId": "67b78904b5da604dfe41b080",
        "freelancers": [
          {
            "_id": "67b79222261b0e2d253fa150",
            "name": "Alice Johnson",
            "email": "alice@example.com",
            "certifications": [
              "Certified Flutter Developer",
              "AWS Certified Developer"
            ],
            "subscriptionStatus": true,
            "subscriptionId": "67b7d63d6ea3454876456d4c",
            "subscriptionDurationInDays": 60,
            "balance": 200,
            "skills": [
              "Flutter",
              "React Native",
              "Dart"
            ],
            "experience": "5 years",
            "reportedCount": 1,
            "role": "freelancer",
            "createdAt": "2025-02-22T14:45:30.182Z",
            "updatedAt": "2025-02-23T10:23:23.528Z",
            "__v": 0
          }
        ],
        "budget": 7000,
        "type": "remote",
        "status": "open",
        "milestones": [
          {
            "_id": "67b78ea8de2c05b5a4094279",
            "jobId": "67b78ea7de2c05b5a4094276",
            "title": "UI/UX Design",
            "description": "Create wireframes and UI design.",
            "amount": 2000,
            "dueDate": "2025-03-10T00:00:00.000Z",
            "status": "pending",
            "createdBy": "67b78904b5da604dfe41b080",
            "createdAt": "2025-02-22T14:56:08.164Z",
            "updatedAt": "2025-02-22T14:56:08.165Z",
            "__v": 0
          },
          {
            "_id": "67b78ea8de2c05b5a409427a",
            "jobId": "67b78ea7de2c05b5a4094276",
            "title": "App Development",
            "description": "Develop the app using Flutter.",
            "amount": 3500,
            "dueDate": "2025-04-15T00:00:00.000Z",
            "status": "pending",
            "createdBy": "67b78904b5da604dfe41b080",
            "createdAt": "2025-02-22T14:56:08.165Z",
            "updatedAt": "2025-02-22T14:56:08.165Z",
            "__v": 0
          },
          {
            "_id": "67b78ea8de2c05b5a409427b",
            "jobId": "67b78ea7de2c05b5a4094276",
            "title": "Testing & Deployment",
            "description": "Test the app and deploy it to app stores.",
            "amount": 1500,
            "dueDate": "2025-05-01T00:00:00.000Z",
            "status": "pending",
            "createdBy": "67b78904b5da604dfe41b080",
            "createdAt": "2025-02-22T14:56:08.166Z",
            "updatedAt": "2025-02-22T14:56:08.166Z",
            "__v": 0
          }
        ],
        "teamRequired": false,
        "__v": 1
      },
      {
        "_id": "67b78fa8de2c05b5a4094376",
        "title": "AI Chatbot Development",
        "description": "Build an AI chatbot for customer service automation.",
        "clientId": "67b78904b5da604dfe41b090",
        "freelancers": [
          {
            "_id": "67b79332261b0e2d253fa160",
            "name": "Michael Smith",
            "email": "michael@example.com",
            "certifications": [
              "Google TensorFlow Developer",
              "IBM AI Engineer"
            ],
            "subscriptionStatus": true,
            "subscriptionId": "67b7e63d6ea3454876456d5d",
            "subscriptionDurationInDays": 90,
            "balance": 500,
            "skills": [
              "Python",
              "Machine Learning",
              "NLP"
            ],
            "experience": "6 years",
            "reportedCount": 0,
            "role": "freelancer",
            "createdAt": "2025-02-22T15:00:00.582Z",
            "updatedAt": "2025-02-23T11:10:23.528Z",
            "__v": 0
          }
        ],
        "budget": 10000,
        "type": "remote",
        "status": "in-progress",
        "milestones": [
          {
            "_id": "67b78fa8de2c05b5a4094379",
            "jobId": "67b78fa8de2c05b5a4094376",
            "title": "Dataset Collection",
            "description": "Gather and preprocess training data.",
            "amount": 2500,
            "dueDate": "2025-03-20T00:00:00.000Z",
            "status": "pending",
            "createdBy": "67b78904b5da604dfe41b090",
            "createdAt": "2025-02-22T15:10:08.164Z",
            "updatedAt": "2025-02-22T15:10:08.165Z",
            "__v": 0
          },
          {
            "_id": "67b78fa8de2c05b5a409437a",
            "jobId": "67b78fa8de2c05b5a4094376",
            "title": "Model Development",
            "description": "Train the AI model for chatbot responses.",
            "amount": 5000,
            "dueDate": "2025-04-30T00:00:00.000Z",
            "status": "pending",
            "createdBy": "67b78904b5da604dfe41b090",
            "createdAt": "2025-02-22T15:10:08.165Z",
            "updatedAt": "2025-02-22T15:10:08.165Z",
            "__v": 0
          },
          {
            "_id": "67b78fa8de2c05b5a409437b",
            "jobId": "67b78fa8de2c05b5a4094376",
            "title": "Integration & Deployment",
            "description": "Integrate chatbot with customer service system.",
            "amount": 2500,
            "dueDate": "2025-06-01T00:00:00.000Z",
            "status": "pending",
            "createdBy": "67b78904b5da604dfe41b090",
            "createdAt": "2025-02-22T15:10:08.166Z",
            "updatedAt": "2025-02-22T15:10:08.166Z",
            "__v": 0
          }
        ],
        "teamRequired": true,
        "__v": 1
      }
    ]
  );

  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    budget: '',
    type: 'online',
    milestones: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "numMilestones") {
      const count = parseInt(value, 10) || 0;
      setNumMilestones(count);
      setMilestones(Array.from({ length: count }, () => ({ title: "", description: "", amount: 0,dueDate: "" })));
    } else {
      setNewJob({ ...newJob, [name]: value });
    }
  };
  
  const handleMilestoneChange = (index, field, value) => {
    setMilestones((prevMilestones) =>
      prevMilestones.map((milestone, i) =>
        i === index ? { ...milestone, [field]: value } : milestone
      )
    );
  };
  

  const saveNewJob = () => {
    const newJobObj = {
      ...newJob,
      _id: Date.now().toString(),
      clientId: "67b78904b5da604dfe41b080",
      freelancers: [],
      milestones,
      status: "open",
      teamRequired: false,
      __v: 0
    };
  
    setJobsByClient([...jobsByClient, newJobObj]);
    setPostingNewJob(false);
    setStep(1);
    setNewJob({
      title: '',
      description: '',
      budget: '',
      type: 'online',
      milestones: []
    });
    setMilestones([]);
    setNumMilestones(0);
  };
  

  const handleJobDetails = (jobId) => {
    const selectedJob = jobsByClient.find(job => job._id === jobId);
    setIsJobDetails(selectedJob);
    setSelectedJobId(jobId);
  };

  const handlePostingNewJob = () => {
    setPostingNewJob(true);
  };

  const closeAllModals = () => {
    setIsJobDetails(null);
    setShowMilestones(false);
    setShowFreelancers(false);
    setSelectedJobId(null);
  };

  const handleMilestones = () => {
    setShowMilestones(!showMilestones);
  };

  const handleFreelancers = () => {
    setShowFreelancers(!showFreelancers);
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-[var(--background-color)]">
      <h1 className="text-4xl md:text-5xl font-bold text-center my-6 text-[var(--text-primary)]">
        Client Dashboard
      </h1>
      <div className="flex justify-center gap-3">
        <div className='w-2/4'>
          <ClientProfile/>
        </div>
        <div>
          <div className="grid justify-center gap-6">
            {/* Jobs Section */}
            {jobsByClient.map((job) => (
              <div 
                key={job._id} 
                className="flex flex-col items-center p-5 bg-gray-600/15 rounded-lg shadow-2xl cursor-pointer hover:shadow-xl transition-all"
                onClick={() => handleJobDetails(job._id)} 
              >
                <h2 className="text-2xl font-semibold">{job.title}</h2>
                <p className="text-[var(--text-secondary)] mt-2">{job.description}</p>
                <p className="mt-4 text-lg font-semibold text-gray-800">
                  Budget: <span className="text-[var(--success)]">${job.budget}</span>
                </p>
              </div>
            ))}
            <button 
              type="button" 
              className="bg-[var(--success)] w-1/2 mx-auto text-white px-6 py-3 rounded-xl hover:rounded-4xl hover:cursor-pointer hover:text-white-300 font-semibold shadow-lg transition-all duration-300 ease-in-out 
                        hover:bg-green-700 hover:shadow-xl 
                        active:scale-95"
              onClick={handlePostingNewJob}
            >
              Post New Job
            </button>

          </div>

          {postingNewJob && (
            <div className="fixed inset-0 z-50 bg-gray-600/15 flex justify-center items-center backdrop-blur-sm">
              <div className="relative transition-all transform bg-[var(--card-background)] bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-6 w-[350px] max-w-[400px] z-10 animate-fadein">
                
                {/* Step 1: Job Details */}
                {step === 1 && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900">Post a New Job</h2>
                    <input 
                      type="text" 
                      placeholder="Job Title" 
                      className="w-full mt-4 p-2 rounded-md" 
                      name="title"
                      value={newJob.title}
                      onChange={handleInputChange}
                    />
                    <textarea 
                      placeholder="Job Description" 
                      className="w-full mt-2 p-2 rounded-md" 
                      name="description"
                      value={newJob.description}
                      onChange={handleInputChange}
                    />
                    <input 
                      type="number" 
                      placeholder="Budget" 
                      className="w-full mt-2 p-2 rounded-md" 
                      name="budget"
                      value={newJob.budget}
                      onChange={handleInputChange}
                    />
                    <select 
                      className="w-full mt-2 p-2 rounded-md" 
                      name="type"
                      value={newJob.type}
                      onChange={handleInputChange}
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                    <input 
                      type="number" 
                      placeholder="No. of Milestones" 
                      className="w-full mt-2 p-2 rounded-md" 
                      name="numMilestones"
                      value={numMilestones||''}
                      onChange={handleInputChange}
                    />

                    <div className="flex justify-between mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 text-[var(--primary)] bg-[var(--button-background)] rounded-md hover:bg-[var(--button-hover-background)]"
                        onClick={() => setPostingNewJob(false)}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 text-[var(--primary)] bg-[var(--button-background)] rounded-md hover:bg-[var(--button-hover-background)]"
                        onClick={() => setStep(2)}
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}

                {/* Step 2: Milestone Details */}
                {step === 2 && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900">Define Milestones</h2>
                    {milestones.map((milestone, index) => (
                      <div key={index} className="mt-4 p-3 bg-white/20 rounded-md">
                        <input 
                          type="text" 
                          placeholder={`Milestone ${index + 1} Title`} 
                          className="w-full p-2 rounded-md border border-gray-600" 
                          value={milestone.title}
                          onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                        />
                        <textarea 
                          placeholder="Description" 
                          className="w-full mt-2 p-2 rounded-md border border-gray-600" 
                          value={milestone.description}
                          onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                        />
                        <input 
                          type="number" 
                          placeholder="Amount" 
                          className="w-full mt-2 p-2 rounded-md border border-gray-600" 
                          value={milestone.amount||''}
                          onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
                        />
                        <input 
                          type="date" 
                          className="w-full mt-2 p-2 rounded-md border border-gray-600" 
                          value={milestone.dueDate}
                          onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
                        />
                      </div>
                    ))}

                    <div className="flex justify-between mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 text-[var(--primary)] bg-[var(--button-background)] rounded-md hover:bg-[var(--button-hover-background)]"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 text-[var(--primary)] bg-[var(--button-background)] rounded-md hover:bg-[var(--button-hover-background)]"
                        onClick={saveNewJob}
                      >
                        Post Job
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}


          {/* Job Details Modal */}
          {isJobDetails && (
            <div className="fixed inset-0 z-50 bg-gray-600/15 flex justify-center items-center backdrop-blur-sm">
              <div className="relative transition-all transform bg-[var(--card-background)] bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-6 w-[350px] max-w-[400px] z-10 animate-fadein">
                <h2 className="text-2xl font-bold text-gray-900">{isJobDetails.title}</h2>
                <p className="mt-2 text-gray-700">{isJobDetails.description}</p>
                <p className="mt-4 text-lg font-semibold text-gray-800">
                  Budget: ${isJobDetails.budget}
                </p>

                <div className="flex justify-between mt-4">
                  <button 
                    className="px-4 py-2 text-[var(--primary)] bg-[var(--button-background)] rounded-md hover:bg-[var(--button-hover-background)]"
                    onClick={handleFreelancers}
                  >
                    Freelancers
                  </button>
                  <button 
                    className="px-4 py-2 text-[var(--primary)] bg-[var(--button-background)] rounded-md hover:bg-[var(--button-hover-background)]"
                    onClick={handleMilestones}
                  >
                    Milestones
                  </button>
                </div>

                <button 
                  className="px-4 py-2 my-4 text-[var(--primary)] bg-[var(--button-background)] rounded-md hover:bg-[var(--button-hover-background)]"
                  onClick={closeAllModals}
                >
                  Close
                </button>
              </div>

              {showFreelancers && (
                <div className="absolute left-[calc(70%+20px)] top-0 transition-all transform bg-white/60 bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-6 w-[350px] max-w-[400px] z-20 animate-slidein-left">
                  <h3 className="text-xl font-bold text-gray-900">Freelancers</h3>
                  {isJobDetails.freelancers.length>0 ? (
                    isJobDetails.freelancers.map((freelancer) => (
                      <div key={freelancer._id} className="mt-4 text-gray-700">
                        <p><strong>{freelancer.name}</strong></p>
                        <p>Email: {freelancer.email}</p>
                        <p>Experience: {freelancer.experience}</p>
                        <p>Balance: ${freelancer.balance}</p>
                        <p>Skills: {freelancer.skills.join(", ")}</p>
                        <p>Certifications: {freelancer.certifications.join(", ")}</p>
                        <p>Subscription Duration: {freelancer.subscriptionDurationInDays} days</p>
                        <div className="flex justify-between items-center">
                          <button type="button" className="confirm p-2 rounded-lg cursor-pointer">Confirm</button>
                          <button type="button" className="decline p-2 rounded-lg cursor-pointer">Decline</button>
                        </div>
                      </div>
                    ))
                  ) : (<p>No freelancers Raised a Gig</p>)}
                </div>
              )}

              {
                showMilestones && (
                <div className="absolute right-[calc(70%+20px)] top-0 transition-all transform bg-white/60 bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-6 w-[350px] max-w-[400px] z-20 animate-slidein-right">
                  <h3 className="text-xl font-bold text-gray-900">Milestones</h3>
                  {
                    isJobDetails.milestones.map((milestone) => (
                    <div key={milestone._id} className="mt-4 text-gray-700">
                      <p><strong>{milestone.title}</strong></p>
                      <p>{milestone.description}</p>
                      <p>Amount: ${milestone.amount}</p>
                      <p>Due Date: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;