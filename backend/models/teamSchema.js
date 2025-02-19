const mongoose =require('mongoose')

const teamSchema = new mongoose.Schema({
    name: {
      type:String
    },

    members: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      },
    ],

    jobId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Job' 
    },

    paymentSplit: [
      { 
        userId: {
          type:mongoose.Schema.Types.ObjectId
        },

        amount: {
          type: Number
        } 
      },
    ],
    status: { 
      type: String, 
      enum: ['active', 'completed'] 
    },
    
  });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
