const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    required: true
  },
  joinTime: {
    type: Date,
    default: Date.now
  },
  leaveTime: {
    type: Date
  }
});

const meetingSchema = new mongoose.Schema({
  meetingId: {
    type: String,
    required: true,
    index: true
  },
  roomId: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  participants: [participantSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Create compound index for efficient queries
meetingSchema.index({ meetingId: 1, isActive: 1 });
meetingSchema.index({ 'participants.userId': 1 });

module.exports = mongoose.model('Meeting', meetingSchema);
