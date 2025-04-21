// This is a suggestion for updating the gigSchema to support team applications
// Update your gigSchema.js file

const mongoose = require("mongoose")

const gigSchema = new mongoose.Schema(
  {
    jobID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Freelancer",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    // Add these fields to support team applications
    isTeamApplication: {
      type: Boolean,
      default: false,
    },
    teamID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  },
  { timestamps: true },
)

const Gig = mongoose.model("Gig", gigSchema)
module.exports = Gig
