// This is a suggestion for the backend API route
// Add these routes to your freelancerApi.js file

// Import necessary modules and functions
const freelancerApp = require("express").Router() // Assuming you're using Express
const { protect, freelancerOnly } = require("../middleware/authMiddleware") // Adjust path as needed
const { createTeam, getAllTeams, getTeamByID } = require("../controllers/teamController") // Adjust path as needed

// Teams CRUD
freelancerApp.post("/teams", protect, freelancerOnly, createTeam)
freelancerApp.get("/teams", protect, freelancerOnly, getAllTeams)
freelancerApp.get("/teams/:teamID", protect, freelancerOnly, getTeamByID)
