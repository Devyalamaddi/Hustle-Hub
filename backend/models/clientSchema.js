const mongoose = require('mongoose');
const validator = require('validator');

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    industry: {
      type: String,
      required: true,
    },

    contactInfo: {
      type: String,
      required: true,
    },

    email: { 
      type: String, 
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email address'
      }
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
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

    
  },
  { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
