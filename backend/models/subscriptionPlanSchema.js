const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  planType: {
    type: String,
    enum: ['beginner_boost', 'basic', 'pro'],
    required: true,
  },
  for:{
    type:String,
    required: true
  },
  features: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isOneTime: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    required: true,
  },
});

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

module.exports = SubscriptionPlan;
