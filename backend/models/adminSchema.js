const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    subscriptionPlans: [
      {
        planName: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        features: [String],
        duration: {
          type: Number, // in months
          required: true
        }
      }
    ],

    fraudReports: [
      {
        reportedUser: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'reportedUserModel'
        },
        reportedUserModel: {
          type: String,
          enum: ['Client', 'Freelancer']
        },
        reporter: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'reporterModel'
        },
        reporterModel: {
          type: String,
          enum: ['Client', 'Freelancer']
        },
        reason: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    status: {
      type: Boolean,
      default: true
    },

    disabledUsers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'userModel'
        },
        userModel: {
          type: String,
          enum: ['Client', 'Freelancer']
        },
        disabledAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
