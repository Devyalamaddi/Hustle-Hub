// This is a suggestion for updating the jobSchema to support team-based jobs
// Update your jobSchema.js file

const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "cancelled"],
      default: "open",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    // Add this field to support team-based jobs
    teamRequired: {
      type: Boolean,
      default: false,
    },
    // Minimum team size (optional)
    minTeamSize: {
      type: Number,
      default: 2,
    },
    // Maximum team size (optional)
    maxTeamSize: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true },
)

const Job = mongoose.model("Job", jobSchema)
module.exports = Job
