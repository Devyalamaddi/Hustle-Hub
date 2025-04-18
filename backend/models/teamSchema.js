const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },

    members: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Freelancer',
        required: true, 
      },
    ],

    // Adding roles to track team hierarchy
    roles: {
      type: Map,
      of: {
        type: String,
        enum: ['admin', 'member']
      },
      default: {}
    },

    status: { 
      type: String, 
      enum: ['active', 'completed'],
      default: 'active'
    },
    
  }, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;