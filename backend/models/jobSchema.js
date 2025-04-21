const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
    },

    description: {
        type: String,
    },

    clientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Client' 
    },

    freelancers: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Freelancer' 
        }
    ],

    budget: {
        type: Number,
    },

    type: { 
        type: String, 
        enum: ['online', 'offline'] 
    },

    status: { 
        type: String, 
        enum: ['open', 'in-progress', 'completed'] 
    },

    milestones: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Milestone' 
        }
    ],

    teamRequired: {
        type: Boolean,
        default: false,
    },
    // Minimum team size (optional)
    minTeamSize: {
        type: Number,
        default: 2,
    },
    // Maximum team size (optional)
    maxTeamSize: {
        type: Number,
        default: 10,
    },
},{timestamps:true});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
