const express = require('express');
const clientApp = express.Router();
// const Client = require('../models/Schema');
const Job = require('../models/jobSchema');
const Gig = require('../models/gigSchema');
const { createClient,clientLogin, getAllClients, getAllClientsByID, updateProfileClient,createJob, deleteProfileClient, getAllJobs, getJobById, updateJob, deleteJob, finaliseFreelancer, getGigsByJob, getSubscriptionPlansForClients, buySubscription, reportFreelancer } = require('../controllers/clientController');
// const { createJob } = require('../controllers/jobController');
const { clientOnly, protect } = require('../utils/authUtils');

// Client routes
clientApp.post('/signin', createClient);//d
clientApp.post('/login', clientLogin);//d
clientApp.get('/clients', getAllClients);
clientApp.get('/clients/:id', getAllClientsByID);
clientApp.put('/clients/:id',  protect, clientOnly,updateProfileClient);
clientApp.delete('/clients/:id',  protect, clientOnly, deleteProfileClient);

// Job routes
clientApp.post('/post-job', protect, clientOnly,createJob);//d
clientApp.get('/jobs',protect, getAllJobs);//d
clientApp.get('/jobs/:id', getJobById);//d
clientApp.put('/jobs/:id', protect, clientOnly, updateJob);
clientApp.delete('/jobs/:id', protect, clientOnly,deleteJob);

// Get all gigs for a job and update with finalized freelancer
clientApp.get('/jobs/:jobID/gigs', getGigsByJob);//d
clientApp.post('/jobs/:jobID/confirm-gig/:freelancerID', finaliseFreelancer);//d

//subscriptions
clientApp.get('/subscriptions', getSubscriptionPlansForClients);//d
clientApp.post('/buy-subscription/:subscriptionPlanID', protect, buySubscription);

//reporting a freelancer
clientApp.post('/report-freelancer/:freelancerID', protect, clientOnly, reportFreelancer )

// To Do:
//password recovery
//password reset

module.exports = clientApp;
