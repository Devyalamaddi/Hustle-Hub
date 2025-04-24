const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');

// Record meeting activity (join/leave)
router.post('/', meetingController.recordMeetingActivity);

// Get meeting history for a user
router.get('/', meetingController.getMeetingHistory);

// Get meeting details
router.get('/:meetingId', meetingController.getMeetingDetails);

// Update meeting title
router.patch('/:meetingId/title', meetingController.updateMeetingTitle);

module.exports = router;
