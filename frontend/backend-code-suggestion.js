// This is a suggestion for the backend controller to create teams
// Add this to your freelancerController.js file

const Team = require("../models/Team") // Assuming the Team model is in '../models/Team.js'

const createTeam = async (req, res) => {
  try {
    const { name } = req.body
    const freelancerID = req.user.id

    if (!name) {
      return res.status(400).json({ message: "Team name is required" })
    }

    // Create a new team with the current user as the first member and admin
    const team = await Team.create({
      name,
      members: [freelancerID],
      roles: new Map([[freelancerID, "admin"]]),
      status: "active",
    })

    res.status(201).json({ message: "Team created successfully", team })
  } catch (error) {
    console.log("Error in creating team:", error.message)
    res.status(500).json({ message: error.message })
  }
}

const getAllTeams = async (req, res) => {
  try {
    const freelancerID = req.user.id

    // Find all teams where the user is a member
    const teams = await Team.find({
      members: freelancerID,
    }).populate("members", "name email")

    res.json(teams)
  } catch (error) {
    console.log("Error in getting teams:", error.message)
    res.status(500).json({ message: error.message })
  }
}

// Add these to your module.exports
module.exports = {
  // ... existing exports
  createTeam,
  getAllTeams,
  // ... other exports
}
