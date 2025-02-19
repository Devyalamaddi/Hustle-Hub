const mongoose = require('mongoose');
const validator = require('validator');

const freelancerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },

    email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email address'
      }
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long']
    },

    role: { 
      type: String, 
      enum: ['freelancer', 'client', 'admin'] 
    },

    certifications: [
      {
        type:String
      }
    ],

    subscriptionStatus: { 
      type: Boolean, 
      default: false 
    },

    balance: { 
      type: Number, 
      default: 0 
    },

    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null
    },

    skills:[{
      type:String,
      required:true,
    }],

    experience:{
      type:String,
      required:true,
    },
    
  },
  { timestamps: true }
);

const Freelancer = mongoose.model('Freelancer', freelancerSchema);
module.exports = Freelancer;