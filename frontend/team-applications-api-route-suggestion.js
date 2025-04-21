// This is a suggestion for the backend API route
// Add these routes to your freelancerApi.js file

// Team applications
freelancerApp.get("/team-applications", protect, freelancerOnly, getTeamApplications)
freelancerApp.delete("/team-applications/:id", protect, freelancerOnly, withdrawTeamApplication)
