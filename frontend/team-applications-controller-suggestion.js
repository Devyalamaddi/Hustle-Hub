// This is a suggestion for the backend controller to handle team applications
// Add this to your freelancerController.js file

const getTeamApplications = async (req, res) => {
  try {
    const freelancerID = req.user.id

    // Find all teams where the user is a member
    const teams = await Team.find({
      members: freelancerID,
    }).select("_id")

    const teamIDs = teams.map((team) => team._id)

    // Find all gigs that are team applications for these teams
    const applications = await Gig.find({
      isTeamApplication: true,
      teamID: { $in: teamIDs },
    })
      .populate("jobID", "title budget clientId")
      .populate({
        path: "jobID",
        populate: {
          path: "clientId",
          select: "name",
        },
      })
      .populate({
        path: "teamID",
        select: "name members",
        populate: {
          path: "members",
          select: "name",
        },
      })

    res.json(applications)
  } catch (error) {
    console.log("Error in getting team applications:", error.message)
    res.status(500).json({ message: error.message })
  }
}

const withdrawTeamApplication = async (req, res) => {
  try {
    const { id } = req.params
    const freelancerID = req.user.id

    // Find the application
    const application = await Gig.findById(id)
    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    // Check if it's a team application
    if (!application.isTeamApplication) {
      return res.status(400).json({ message: "This is not a team application" })
    }

    // Check if the user is a member of the team
    const team = await Team.findById(application.teamID)
    if (!team) {
      return res.status(404).json({ message: "Team not found" })
    }

    if (!team.members.includes(freelancerID)) {
      return res.status(403).json({ message: "You are not a member of this team" })
    }

    // Check if the user is the one who created the application or is an admin
    const isAdmin = team.roles && team.roles.get(freelancerID) === "admin"
    const isCreator = application.userID.toString() === freelancerID

    if (!isAdmin && !isCreator) {
      return res
        .status(403)
        .json({ message: "Only the application creator or team admin can withdraw this application" })
    }

    // Delete the application
    await Gig.findByIdAndDelete(id)

    res.json({ message: "Team application withdrawn successfully" })
  } catch (error) {
    console.log("Error in withdrawing team application:", error.message)
    res.status(500).json({ message: error.message })
  }
}

// Add these to your module.exports
module.exports = {
  // ... existing exports
  getTeamApplications,
  withdrawTeamApplication,
  // ... other exports
}
