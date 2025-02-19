const express = require('express');
const clientApp = express.Router();
// const Client = require('../models/Schema');
const Job = require('../models/jobSchema');
const Gig = require('../models/gigSchema');
const { createClient,clientLogin, getAllClients, getAllClientsByID, updateProfileClient, deleteProfileClient, getAllJobs, getJobById, updateJob, deleteJob, finaliseFreelancer } = require('../controllers/clientController');
const { createJob } = require('../controllers/jobController');
const { clientOnly, protect } = require('../utils/authUtils');

// Client routes
clientApp.post('/signin', createClient);
clientApp.post('/login', clientLogin);
clientApp.get('/clients', getAllClients);
clientApp.get('/clients/:id', getAllClientsByID);
clientApp.put('/clients/:id',  protect, clientOnly,updateProfileClient);
clientApp.delete('/clients/:id',  protect, clientOnly, deleteProfileClient);

// Job routes
clientApp.post('/post-job', protect, clientOnly,createJob);
clientApp.get('/jobs', getAllJobs);
clientApp.get('/jobs/:id', getJobById);
clientApp.put('/jobs/:id', protect, clientOnly, updateJob);
clientApp.delete('/jobs/:id', protect, clientOnly,deleteJob);

// Get all gigs for a job and update with finalized freelancer
clientApp.get('/jobs/:jobID/gigs', finaliseFreelancer);

module.exports = clientApp;
