const express = require('express');
const freelancerApp = express.Router();
// const Gig = require('../models/gigSchema');
const { 
    createFreelancer, 
    getAllFreelancers, 
    getFreelancerByID, 
    updateProfileFreelancer, 
    deleteProfileFreelancer, 
    freelancerLogin, 
    getJobPosts, 
    createGig, 
    getGigs,withdrawGig, 
    buySubscription, 
    getSubscriptionPlans, 
    reportClient, 
    sendTeamInvitation, 
    getTeamInvitations, 
    acceptTeamInvitation, 
    rejectTeamInvitation, 
    leaveTeam, 
    removeMemberFromTeam, 
    updateMemberRole, 
    getTeamApplications, 
    withdrawTeamApplication, 
    createTeam, 
    getAllTeams, 
    getTeamById,
    applyAsTeam,
    getAllJobPosts } = require('../controllers/freelancerController');
const { protect, freelancerOnly } = require('../utils/authUtils');

freelancerApp.post('/signup', createFreelancer);//d
freelancerApp.post('/login', freelancerLogin);//d
freelancerApp.get('/freelancers', getAllFreelancers);//d
freelancerApp.get('/freelancers/:id', getFreelancerByID);//d
freelancerApp.put('/freelancers/:id', protect,freelancerOnly,updateProfileFreelancer);//d
freelancerApp.delete('/freelancers/:id', protect,freelancerOnly,deleteProfileFreelancer);

// Create a new gig
freelancerApp.post('/gigs', protect,freelancerOnly, createGig);//d
freelancerApp.get('/gigs',protect,getGigs);//d
freelancerApp.delete('/gigs/:id', protect, freelancerOnly, withdrawGig);//d

//to get all job posts from clients
freelancerApp.get('/job-posts/:freelancerID',getJobPosts);//d
freelancerApp.get('/all-job-posts',getAllJobPosts);

//teams CRUD 
freelancerApp.post('/teams', protect, freelancerOnly, createTeam);//d
freelancerApp.get('/teams', protect, freelancerOnly, getAllTeams);//d
freelancerApp.get('/teams/:teamID', protect, freelancerOnly, getTeamById);//d
// freelancerApp.put('/teams/:teamID', protect, freelancerOnly, updateTeam);
// freelancerApp.delete('/teams/:teamID', protect, freelancerOnly, deleteTeam);

freelancerApp.get("/team-applications", protect, freelancerOnly, getTeamApplications);
freelancerApp.delete("/team-applications/:id", protect, freelancerOnly, withdrawTeamApplication);

freelancerApp.post('/jobs/:jobId/apply-as-team/:teamID', protect, freelancerOnly, applyAsTeam);
freelancerApp.get('/team-invitations', protect, freelancerOnly, getTeamInvitations);//d
freelancerApp.post('/teams/:teamID/accept-invitation', protect, freelancerOnly, acceptTeamInvitation);//d
freelancerApp.post('/teams/:teamID/invite/:freelancerID', protect, freelancerOnly, sendTeamInvitation);//d
freelancerApp.post('/teams/:teamID/leave', protect, freelancerOnly, leaveTeam);//d
freelancerApp.post('/teams/:teamID/reject-invitation', protect, freelancerOnly, rejectTeamInvitation);//d
freelancerApp.post('/teams/:teamID/remove/:memberID', protect, freelancerOnly, removeMemberFromTeam);
freelancerApp.put('/teams/:teamID/members/:memberID/role', protect, freelancerOnly, updateMemberRole);


// subscriptions (todo: payment gateway)
freelancerApp.get('/subscriptions', getSubscriptionPlans);//d
freelancerApp.post('/buy-subscription/:subscriptionPlanID',protect,buySubscription);

//reporting a Client
freelancerApp.post('/report-client/:clientID', protect, reportClient);

// Meeting routes
const {
  createMeeting,
  getMeetingsForFreelancer,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} = require('../controllers/freelancerController');

freelancerApp.post('/meetings', protect, freelancerOnly, createMeeting);
freelancerApp.get('/meetings', protect, freelancerOnly, getMeetingsForFreelancer);
freelancerApp.get('/meetings/:id', protect, freelancerOnly, getMeetingById);
freelancerApp.put('/meetings/:id', protect, freelancerOnly, updateMeeting);
freelancerApp.delete('/meetings/:id', protect, freelancerOnly, deleteMeeting);

module.exports = freelancerApp;

