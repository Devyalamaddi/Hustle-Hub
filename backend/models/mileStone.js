const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    jobId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Job',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    dueDate: {
      type: Date,
      required: true
    },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'paid'],
      default: 'pending'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
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

const Milestone = mongoose.model('Milestone', milestoneSchema);
module.exports = Milestone;
