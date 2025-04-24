// This file shows how to integrate the meeting routes into your existing Express app

const express = require('express');
const app = express(); // Your existing Express app
const meetingRoutes = require('./routes/meetingRoutes');

// Middleware
app.use(express.json());

// Meeting routes
app.use('/api/meetings', meetingRoutes);

// Example of how to integrate with your existing app
module.exports = {
  setupMeetingRoutes: (app) => {
    app.use('/api/meetings', meetingRoutes);
  }
};
