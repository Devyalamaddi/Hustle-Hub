const mongoose = require('mongoose');

const teamInvitationSchema = new mongoose.Schema({
  teamID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freelancer',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freelancer',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const TeamInvitation = mongoose.model('TeamInvitation', teamInvitationSchema);
module.exports = TeamInvitation;