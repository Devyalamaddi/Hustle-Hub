const express = require('express');
const freelancerApp = express.Router();
// const Gig = require('../models/gigSchema');
const { createFreelancer, getAllFreelancers, getFreelancerByID, updateProfileFreelancer, deleteProfileFreelancer, freelancerLogin, createGig,buySubscription, getSubscriptionPlans  } = require('../controllers/freelancerController');
const { protect, freelancerOnly } = require('../utils/authUtils');

freelancerApp.post('/signup', createFreelancer);
freelancerApp.post('/login', freelancerLogin);
freelancerApp.get('/freelancers', getAllFreelancers);
freelancerApp.get('/freelancers/:id', getFreelancerByID);
freelancerApp.put('/freelancers/:id', protect,freelancerOnly,updateProfileFreelancer);
freelancerApp.delete('/freelancers/:id', protect,freelancerOnly,deleteProfileFreelancer);

// Create a new gig
freelancerApp.post('/gigs', protect,freelancerOnly, createGig);

// todo: subscription
freelancerApp.get('/subscriptions', getSubscriptionPlans);
freelancerApp.post('/buy-subscription/:subscriptionPlanID',protect,buySubscription);


module.exports = freelancerApp;
