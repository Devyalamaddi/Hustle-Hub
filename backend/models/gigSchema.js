const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    jobID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Freelancer',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    // New fields for team applications
    isTeamApplication: {
        type: Boolean,
        default: false
    },
    teamID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Gig = mongoose.model('Gig', gigSchema);

module.exports = Gig;