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
    isTeamApplication: {
        type: Boolean,
        default: false
    },
    teamID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
},{timestamps:true});

// // ✅ Composite unique index
gigSchema.index({ jobID: 1, userID: 1 }, { unique: true });

const Gig = mongoose.model('Gig', gigSchema);

module.exports = Gig;
