const express = require('express');
const freelancerApp = express.Router();
// const Gig = require('../models/gigSchema');
const { createFreelancer, getAllFreelancers, getFreelancerByID, updateProfileFreelancer, deleteProfileFreelancer, freelancerLogin, getJobPosts, createGig, getGigs,createTeam , getAllTeams,getTeamByID,updateTeam, deleteTeamByID, buySubscription, getSubscriptionPlans, reportClient  } = require('../controllers/freelancerController');
const { protect, freelancerOnly } = require('../utils/authUtils');

freelancerApp.post('/signup', createFreelancer);//d
freelancerApp.post('/login', freelancerLogin);//d
freelancerApp.get('/freelancers', getAllFreelancers);
freelancerApp.get('/freelancers/:id', getFreelancerByID);
freelancerApp.put('/freelancers/:id', protect,freelancerOnly,updateProfileFreelancer);//d
freelancerApp.delete('/freelancers/:id', protect,freelancerOnly,deleteProfileFreelancer);

// Create a new gig
freelancerApp.post('/gigs', protect,freelancerOnly, createGig);//d
freelancerApp.get('/gigs',protect,getGigs);//d

//to get all job posts from clients
freelancerApp.get('/job-posts',getJobPosts);//d

//todo: teams CRUD  //d
freelancerApp.post('/teams/:teamID/invite/:freelancerID', protect, freelancerOnly, sendTeamInvitation);
freelancerApp.get('/team-invitations', protect, freelancerOnly, getTeamInvitations);
freelancerApp.post('/teams/:teamID/accept-invitation', protect, freelancerOnly, acceptTeamInvitation);
freelancerApp.post('/teams/:teamID/reject-invitation', protect, freelancerOnly, rejectTeamInvitation);
freelancerApp.post('/teams/:teamID/leave', protect, freelancerOnly, leaveTeam);
freelancerApp.post('/teams/:teamID/remove/:memberID', protect, freelancerOnly, removeMemberFromTeam);
freelancerApp.put('/teams/:teamID/members/:memberID/role', protect, freelancerOnly, updateMemberRole);


// subscriptions (todo: payment gateway)
freelancerApp.get('/subscriptions', getSubscriptionPlans);
freelancerApp.post('/buy-subscription/:subscriptionPlanID',protect,buySubscription);

//reporting a Client
freelancerApp.post('/report-client/:clientID', protect, reportClient);


module.exports = freelancerApp;

