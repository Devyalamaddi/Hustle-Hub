const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    }],

    planType: {
        type: String,
        enum: ['beginner_boost', 'basic', 'pro', 'premium'],
        required: true
    },

    status: { 
        type: String, 
        enum: ['active', 'expired'], 
        default: 'active'
    },

    features: {
        type: [String],
        default: []
    },

    price: {
        type: Number,
        required: true
    },

    isOneTime: {  
        type: Boolean,  
        default: false  
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
