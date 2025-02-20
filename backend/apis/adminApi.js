const express = require('express');
const router = express.Router();
const {getDisabledUsers} = require('../controllers/adminController');
const { protect, adminOnly } = require('../utils/authUtils');

// // Update subscription plans
// router.post('/subscription-plans',protect,adminOnly, adminController.updateSubscriptionPlans);

// // Report a user
// router.post('/report-user',protect,adminOnly , adminController.reportUser);

// Get disabled users
router.get('/disabled-users',getDisabledUsers);

module.exports = router;
