const express = require('express');
const clientApp = express.Router();
const Job = require('../models/jobSchema');
const Gig = require('../models/gigSchema');
const { createClient,clientLogin, getAllClients, getAllClientsByID, updateProfileClient,createJob, deleteProfileClient, getAllJobs, getJobById, updateJob, deleteJob, finaliseFreelancer, getGigsByJob, getSubscriptionPlansForClients, buySubscription, reportFreelancer, updateMilestone } = require('../controllers/clientController');
const { clientOnly, protect } = require('../utils/authUtils');

// Client routes
clientApp.post('/signin', createClient);//d
clientApp.post('/login', clientLogin);//d
clientApp.get('/clients', getAllClients);//d
clientApp.get('/clients/:id', getAllClientsByID);//d
clientApp.put('/clients/:id',  protect, clientOnly,updateProfileClient);//d
clientApp.delete('/clients/:id',  protect, clientOnly, deleteProfileClient);

// Job routes
clientApp.post('/post-job', protect, clientOnly,createJob);//d
clientApp.get('/jobs',protect, getAllJobs);//d
clientApp.get('/jobs/:id', getJobById);//d
clientApp.put('/jobs/:id', protect, clientOnly, updateJob);//d
clientApp.delete('/jobs/:id', protect, clientOnly,deleteJob);

//milestones Update route
clientApp.put('/jobs/:jobId/milestones/:milestoneId', protect, clientOnly, updateMilestone);//d

// Get all gigs for a job and update with finalized freelancer
clientApp.get('/jobs/:jobID/gigs', getGigsByJob);//d
clientApp.post('/jobs/:jobID/confirm-gig/:freelancerID', finaliseFreelancer);//d

//subscriptions
clientApp.get('/subscriptions', getSubscriptionPlansForClients);//d
clientApp.post('/buy-subscription/:subscriptionPlanID', protect, buySubscription);

//reporting a freelancer
clientApp.post('/report-freelancer/:freelancerID', protect, clientOnly, reportFreelancer );

// Meeting routes
const {
  createMeeting,
  getMeetingsForClient,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} = require('../controllers/clientController');

clientApp.post('/meetings', protect, clientOnly, createMeeting);
clientApp.get('/meetings', protect, clientOnly, getMeetingsForClient);
clientApp.get('/meetings/:id', protect, clientOnly, getMeetingById);
clientApp.put('/meetings/:id', protect, clientOnly, updateMeeting);
clientApp.delete('/meetings/:id', protect, clientOnly, deleteMeeting);

module.exports = clientApp;
