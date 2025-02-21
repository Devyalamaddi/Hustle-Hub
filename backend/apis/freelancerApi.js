const express = require('express');
const freelancerApp = express.Router();
// const Gig = require('../models/gigSchema');
const { createFreelancer, getAllFreelancers, getFreelancerByID, updateProfileFreelancer, deleteProfileFreelancer, freelancerLogin, createGig, getGigs,createTeam , getAllTeams,getTeamByID,updateTeam, deleteTeamByID, buySubscription, getSubscriptionPlans, reportClient  } = require('../controllers/freelancerController');
const { protect, freelancerOnly } = require('../utils/authUtils');

freelancerApp.post('/signup', createFreelancer);
freelancerApp.post('/login', freelancerLogin);
freelancerApp.get('/freelancers', getAllFreelancers);
freelancerApp.get('/freelancers/:id', getFreelancerByID);
freelancerApp.put('/freelancers/:id', protect,freelancerOnly,updateProfileFreelancer);
freelancerApp.delete('/freelancers/:id', protect,freelancerOnly,deleteProfileFreelancer);

// Create a new gig
freelancerApp.post('/gigs', protect,freelancerOnly, createGig);
freelancerApp.get('/gigs',protect,getGigs);

//todo: teams CRUD
freelancerApp.post('/teams/new-team', protect, createTeam);
freelancerApp.get('/teams',protect, getAllTeams);
freelancerApp.get('/teams/:teamID', protect, getTeamByID);
freelancerApp.put('/teams/update-team/:teamID/',protect, updateTeam);
freelancerApp.delete('/teams/delete-team/:teamID', protect, deleteTeamByID);

// subscriptions (todo: payment gateway)
freelancerApp.get('/subscriptions', getSubscriptionPlans);
freelancerApp.post('/buy-subscription/:subscriptionPlanID',protect,buySubscription);

//reporting a Client
freelancerApp.post('/report-client/:clientID', protect, reportClient )

module.exports = freelancerApp;
