const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../utils/authUtils');

// Update subscription plans
router.post('/subscription-plans',protect,adminOnly, adminController.updateSubscriptionPlans);

// Report a user
router.post('/report-user',protect,adminOnly , adminController.reportUser);

// Get disabled users
router.get('/disabled-users',protect,adminOnly , adminController.getDisabledUsers);

module.exports = router;
