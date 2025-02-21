const mongoose =require('mongoose')

const teamSchema = new mongoose.Schema({
    name: {
      type:String
    },

    members: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Freelancer',
        required:true, 
      },
    ],

    status: { 
      type: String, 
      enum: ['active', 'completed'] 
    },
    
  });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
