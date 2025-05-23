const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  freelancerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freelancer',
    required: true,
  },
  clientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  clientMeetLink: {
    type: String,
    required: true,
  },
  freelancerMeetLink: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
},{timestamps:true});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
