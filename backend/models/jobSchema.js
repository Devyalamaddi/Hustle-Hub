const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    title: {
      type:String,
    },

    description: {
      type:String,
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
      type:Number,
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
        title: String, 
        amount: Number, 
        status: String 
      }
    ],

    teamRequired: {
      type:Boolean
    },
  });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;