const Freelancer = require('../models/freelancerSchema');
const Gig = require('../models/gigSchema');
const bcrypt=require('bcrypt');
const { validateFreelancer, generateToken } = require('../utils/authUtils');
const SubscriptionPlan = require('../models/subscriptionPlanSchema');
const Client = require('../models/clientSchema');
const Team = require('../models/teamSchema');
const Job = require('../models/jobSchema');
const TeamInvitation = require('../models/TeamInvitation');

// Send an invitation to join a team
const sendTeamInvitation = async (req, res) => {
  try {
    const { teamID, freelancerID } = req.params;
    const senderID = req.user.id;
    
    // Check if team exists
    const team = await Team.findById(teamID);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if sender is in the team
    if (!team.members.includes(senderID)) {
      return res.status(403).json({ message: 'You must be a team member to invite others' });
    }
    
    // Check if sender is admin or the team creator (first member)
    const isAdmin = team.roles && team.roles.get(senderID) === 'admin';
    const isCreator = team.members[0].toString() === senderID;
    
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Only team admins can send invitations' });
    }
    
    // Check if freelancer exists
    const freelancer = await Freelancer.findById(freelancerID);
    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }
    
    // Check if freelancer is already a member
    if (team.members.includes(freelancerID)) {
      return res.status(400).json({ message: 'Freelancer is already a team member' });
    }
    
    // Check if invitation already exists
    const existingInvitation = await TeamInvitation.findOne({
      teamID,
      to: freelancerID,
      status: 'pending'
    });
    
    if (existingInvitation) {
      return res.status(400).json({ message: 'Invitation already sent to this freelancer' });
    }
    
    // Create invitation
    const invitation = await TeamInvitation.create({
      teamID,
      from: senderID,
      to: freelancerID,
      status: 'pending'
    });
    
    res.status(201).json({ message: 'Team invitation sent successfully', invitation });
  } catch (error) {
    console.log("Error in sending team invitation:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all pending invitations for the current user
const getTeamInvitations = async (req, res) => {
  try {
    const freelancerID = req.user.id;
    
    const invitations = await TeamInvitation.find({
      to: freelancerID,
      status: 'pending'
    })
    .populate('teamID', 'name status')
    .populate('from', 'name email');
    
    res.json(invitations);
  } catch (error) {
    console.log("Error in getting team invitations:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Accept a team invitation
const acceptTeamInvitation = async (req, res) => {
  try {
    const { teamID } = req.params;
    const freelancerID = req.user.id;
    
    // Find the invitation
    const invitation = await TeamInvitation.findOne({
      teamID,
      to: freelancerID,
      status: 'pending'
    });
    
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }
    
    // Update invitation status
    invitation.status = 'accepted';
    await invitation.save();
    
    // Add freelancer to the team
    const team = await Team.findById(teamID);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    if (!team.members.includes(freelancerID)) {
      team.members.push(freelancerID);
      
      // Set role as member
      if (!team.roles) {
        team.roles = new Map();
      }
      team.roles.set(freelancerID, 'member');
      
      await team.save();
    }
    
    res.json({ message: 'Team invitation accepted successfully', team });
  } catch (error) {
    console.log("Error in accepting team invitation:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Reject a team invitation
const rejectTeamInvitation = async (req, res) => {
  try {
    const { teamID } = req.params;
    const freelancerID = req.user.id;
    
    // Find the invitation
    const invitation = await TeamInvitation.findOne({
      teamID,
      to: freelancerID,
      status: 'pending'
    });
    
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }
    
    // Update invitation status
    invitation.status = 'rejected';
    await invitation.save();
    
    res.json({ message: 'Team invitation rejected successfully' });
  } catch (error) {
    console.log("Error in rejecting team invitation:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Leave a team
const leaveTeam = async (req, res) => {
  try {
    const { teamID } = req.params;
    const freelancerID = req.user.id;
    
    // Find the team
    const team = await Team.findById(teamID);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if freelancer is a member
    if (!team.members.includes(freelancerID)) {
      return res.status(400).json({ message: 'You are not a member of this team' });
    }
    
    // Remove freelancer from team
    team.members = team.members.filter(member => member.toString() !== freelancerID);
    
    // If team is now empty, delete it
    if (team.members.length === 0) {
      await Team.findByIdAndDelete(teamID);
      return res.json({ message: 'You left the team and it was deleted as no members remained' });
    }
    
    // If the leaving member was an admin, assign admin to the first member
    if (team.roles && team.roles.get(freelancerID) === 'admin') {
      const newAdminID = team.members[0];
      team.roles.set(newAdminID.toString(), 'admin');
    }
    
    // Remove role for the leaving member
    if (team.roles) {
      team.roles.delete(freelancerID);
    }
    
    await team.save();
    res.json({ message: 'You left the team successfully', team });
  } catch (error) {
    console.log("Error in leaving team:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Remove a member from a team (admin only)
const removeMemberFromTeam = async (req, res) => {
  try {
    const { teamID, memberID } = req.params;
    const adminID = req.user.id;
    
    // Find the team
    const team = await Team.findById(teamID);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if user is admin or team creator
    const isAdmin = team.roles && team.roles.get(adminID) === 'admin';
    const isCreator = team.members[0].toString() === adminID;
    
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Only team admins can remove members' });
    }
    
    // Prevent removing yourself through this endpoint
    if (memberID === adminID) {
      return res.status(400).json({ message: 'Cannot remove yourself. Use the leave team endpoint instead' });
    }
    
    // Check if member exists in team
    if (!team.members.includes(memberID)) {
      return res.status(400).json({ message: 'Member not found in team' });
    }
    
    // Remove member from team
    team.members = team.members.filter(member => member.toString() !== memberID);
    
    // Remove member's role
    if (team.roles) {
      team.roles.delete(memberID);
    }
    
    await team.save();
    
    res.json({ message: 'Member removed from team successfully', team });
  } catch (error) {
    console.log("Error in removing team member:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update a team member's role
const updateMemberRole = async (req, res) => {
  try {
    const { teamID, memberID } = req.params;
    const adminID = req.user.id;
    const { role } = req.body;
    
    if (!role || !['admin', 'member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Role must be either "admin" or "member"' });
    }
    
    // Find the team
    const team = await Team.findById(teamID);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if user is admin
    const isAdmin = team.roles && team.roles.get(adminID) === 'admin';
    const isCreator = team.members[0].toString() === adminID;
    
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Only team admins can update roles' });
    }
    
    // Check if member exists in team
    if (!team.members.some(member => member.toString() === memberID)) {
      return res.status(400).json({ message: 'Member not found in team' });
    }
    
    // Update role
    if (!team.roles) {
      team.roles = new Map();
    }
    team.roles.set(memberID, role);
    await team.save();
    
    res.json({ message: `Member role updated to ${role} successfully`, team });
  } catch (error) {
    console.log("Error in updating member role:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get available freelancers for team formation
const getAvailableFreelancers = async (req, res) => {
  try {
    const { jobID } = req.params;
    
    // Check if job exists and requires a team
    const job = await Job.findById(jobID);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (!job.teamRequired) {
      return res.status(400).json({ message: 'This job does not require a team' });
    }
    
    // Find freelancers with relevant skills
    // Note: This assumes job has required skills field or we get them from params
    const { requiredSkills } = req.query;
    let skillsQuery = {};
    
    if (requiredSkills) {
      const skillsArray = requiredSkills.split(',');
      skillsQuery = { skills: { $in: skillsArray } };
    }
    
    // Find freelancers with matching skills
    const freelancers = await Freelancer.find({
      ...skillsQuery,
      role: 'freelancer',
      // Exclude freelancers already in job
      _id: { $nin: job.freelancers || [] }
    }).select('name email skills experience -password');
    
    res.json(freelancers);
  } catch (error) {
    console.log("Error in finding available freelancers:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Apply for a job as a team
const applyForJobAsTeam = async (req, res) => {
  try {
    const { jobID, teamID } = req.params;
    const freelancerID = req.user.id;
    
    // Check if job exists
    const job = await Job.findById(jobID);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (job.status !== 'open') {
      return res.status(400).json({ message: 'This job is not open for applications' });
    }
    
    // Check if team exists
    const team = await Team.findById(teamID);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if user is in the team
    if (!team.members.some(member => member.toString() === freelancerID)) {
      return res.status(403).json({ message: 'You must be a team member to apply with this team' });
    }
    
    // Create a gig on behalf of the team
    const gig = new Gig({
      jobID,
      userID: freelancerID, // Main contact person
      description: `Team Application: ${team.name}. Team ID: ${teamID}`,
      status: 'pending',
      isTeamApplication: true,
      teamID
    });
    
    await gig.save();
    
    res.status(201).json({
      message: 'Successfully applied for the job as a team',
      gig
    });
  } catch (error) {
    console.log("Error in applying for job as team:", error.message);
    res.status(500).json({ message: error.message });
  }
};


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

// module.exports = {

// };


const createMeetingController = require('./meetingController');

const createFreelancer = async (req, res) => {
    try {
        const { name, email, password, skills, experience, portfolio } = req.body;
        
        if (!name || !email || !password || !skills || !experience) {
            return res.status(400).json({ 
                error: 'Name, email, password, skills and experience are required' 
            });
        }

        const hashedpassword= await bcrypt.hash(password, 10);
        req.body.password=hashedpassword;
        
        const freelancer = new Freelancer({
            ...req.body,
            role: 'freelancer'
        });

        await freelancer.save();
        res.status(201).json(freelancer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const freelancerLogin=async (req, res) => {
    const { email, password } = req.body;
    try {
        const freelancer = await validateFreelancer(email, password);
        if (freelancer) {
            const token = await generateToken(freelancer._id);
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllFreelancers = async (req, res) => {
    try {
        const freelancers = await Freelancer.find({ role: 'freelancer' });
        res.json(freelancers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getFreelancerByID = async (req, res) => {
    try {
        const freelancer = await Freelancer.findOne({ 
            _id: req.params.id,
            role: 'freelancer'
        }).populate('subscriptionId');
        if (!freelancer) {
            return res.status(404).json({ error: 'Freelancer not found' });
        }
        res.json(freelancer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProfileFreelancer = async (req, res) => {
    try {
        const updatedFreelancer = await Freelancer.findOneAndUpdate(
            { _id: req.params.id, role: 'freelancer' },
            req.body,
            { new: true }
        );

        if (!updatedFreelancer) {
            return res.status(404).json({ error: 'Freelancer not found' });
        }
        res.json(updatedFreelancer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteProfileFreelancer = async (req, res) => {
    try {
        const deletedFreelancer = await Freelancer.findOneAndDelete({
            _id: req.params.id,
            role: 'freelancer'
        });
        if (!deletedFreelancer) {
            return res.status(404).json({ error: 'Freelancer not found' });
        }
        res.json({ message: 'Freelancer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const createGig = async (req, res) => {
  try {
      const { jobID, description, status } = req.body;
      const userID = req.user.id;
      // console.log(jobID, description, status, userID);
      if (!jobID || !userID || !description) {
          return res.status(400).json({ 
              message: 'Please provide jobID, userID and description' 
          });
      }
      if (status && !['pending', 'accepted', 'rejected'].includes(status)) {
          return res.status(400).json({
              message: 'Status must be one of: pending, accepted, rejected'
          });
      }

      // ✅ Check if the user already submitted a gig for the same job
      const existingGig = await Gig.findOne({ jobID, userID });
      if (existingGig) {
          return res.status(409).json({
              message: 'You have already submitted a gig for this job.'
          });
      }

      const gig = await Gig.create({
          jobID,
          userID,
          description
      });

      res.status(201).json(gig);
  } catch (error) {
      console.log("Error in createGig", error.message);
      res.status(500).json({ message: error.message });
  }
};


const getGigs = async(req,res)=>{
    try{
        const freelancerID = req.user.id;
        const gigs = await Gig.find({userID:freelancerID}).populate('jobID');
        return res.json(gigs);

    }catch(err){
        console.log("Error in getting freelancer's gigs: ",err.message);
        return res.send(500).json({message: err.message});
    }
}

const withdrawGig = async(req,res)=>{
  try{
    const gigID = req.params.id;
    const gig = await Gig.findByIdAndDelete(gigID);
    if(!gig){
      return res.status(404).json({message: "Gig not found"});
    }
    return res.status(200).json({message: "Gig withdrawn successfully"});
  }catch(err){
    console.log("Error in withdrawing gig: ",err.message);
    return res.status(500).json({message: err.message});
  }
}

// const createTeam = async(req,res)=>{
//     try{
//         let {teamName, teamMembers} = req.body;
//         const freelancerID = req.user.id;
//         teamMembers=[...teamMembers,freelancerID]
//         const team = await Team.create({
//             "name":teamName,
//             "members":teamMembers,
//         });
//         return res.status(201).json({"message":"Succesfully created a new team","team":team});
//     }catch(err){
//         console.log("Error in creating Team by freelancer: ", err.message);
//         return res.status(500).json({message:err.message});
//     }
// }

// const getAllTeams = async(req,res)=>{
//     try{
//         const freelancerID=req.user.id;
//         const teams = await Team.find({
//             members:freelancerID,
//         })
//         return res.status(201).json(teams);
//     }catch(err){
//         console.log("Error in getting all teams", err.message);
//         return res.status(500).json("Error in getting all teams");
//     }
// }

// const getTeamByID = async(req,res)=>{
//     try{
//         const {teamID} = req.params;
//         const team = await Team.findById(teamID);
//         return res.json(team);
//     }catch(err){
//         console.log("Error in getting team by id", err.message);
//         return res.status(500).json("Error in getting team by id");
//     }
// }

// const updateTeam =async(req,res)=>{
//     try{
//         const {teamID} = req.params;
//         const {updatedDetails} = req.body;
//         if(updatedDetails){
//             updatedDetails.name=updatedDetails.teamName;
//             delete updatedDetails.teamName;
//         }

//         const updatedTeam = await Team.findByIdAndUpdate(
//             teamID,
//             updatedDetails,
//             {new:true}
//         )

//         return res.status(201).json(updatedTeam);

//     }catch(err){
//         console.log("Error in updating the team details ", err.message);
//         return res.status(500).json("Error in updating the team details");
//     }
// }

// const deleteTeamByID = async(req,res)=>{
//     try{
//         const {teamID} = req.params;
//         const deletedTeam = await Team.findByIdAndDelete(teamID);

//         return res.status(200).json(deletedTeam);
//     }catch(err){
//         console.log("Error in deleting the team",err.message);
//         return res.status(500).json("Error in deleteing the team");
//     }
// }

const getJobPosts = async(req,res)=>{
  const {freelancerID} = req.params;
    try{
      const gigs = await Gig.find({ userID: freelancerID });
      const jobIDs = gigs.map(gig => gig.jobID);
      const jobPosts = await Job.find({ _id: { $in: jobIDs } }).populate('clientId');

      return res.json(jobPosts);
    }catch(err){
      console.log("Error in getting job posts",err.message);
      return res.status(500).json({message:"Error in getting job posts"});
    }
}

const getAllJobPosts =  async(req,res)=>{
  try{
    const jobPosts = await Job.find({}).populate('clientId');
    return res.json(jobPosts);
  }catch(err){
      console.log("Error in getting job posts",err.message);
      return res.status(500).json({message:"Error in getting job posts"});
  }
}


const getSubscriptionPlans = async(req,res)=>{
    try {
        const subscriptionPlans = await SubscriptionPlan.find({for:"freelancer"});
        return res.json(subscriptionPlans);
    } catch (error) {
        console.log("Error in getting the Subcriptions", error.message);
        return res.status(500).json({ error: error.message });
    }
}

const buySubscription = async(req,res)=>{
    try{
        const {subscriptionPlanID } = req.params;
        const freelancerID = req.user.id;
        // console.log(subscriptionPlanID);
        const subscriptionPlan = await SubscriptionPlan.findById({_id:subscriptionPlanID});
        if(!subscriptionPlan){
            return res.status(404).json({message:'subscription not found'});
        }

        const freelancer = await Freelancer.findByIdAndUpdate(
            freelancerID, 
            { 
                $set: { 
                    subscriptionId: subscriptionPlanID, 
                    subscriptionDurationInDays: subscriptionPlan.duration, 
                    subscriptionStatus: true 
                } 
            },
            { new: true } // This ensures the updated document is returned
        );

        return res.status(201).json(freelancer);
    }catch(err){
        console.log("Error in buying subscription",err.message);
        return res.status(500).json({message:"Error in buying subscription"});
    }
}

const reportClient = async(req,res)=>{
    try{
        const {clientID} = req.params;
        const client = await Client.findByIdAndUpdate(
            clientID,
            {
                $inc:{reportedCount:1}
            },
            {new:true}
        );
        
        // console.log("clientID",clientID);
        return res.status(201).json(client);
    }catch(err){
        console.log("Error while reporting a client",err.message);
        return res.status(500).json({message:"Error while reporting a client"});
    }
}

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

const getTeamById = async(req,res)=>{
  try{
    const teamID = req.params.teamID;
    const freelancerID = req.user.id;
    console.log(teamID,freelancerID);
    const team = await Team.findById(teamID).populate("members","name email");
    console.log(team)
    if(!team){
      return res.status(404).json({message:"Team not found"});
    }
    if(!team.members.find((member)=>member._id.toString()===freelancerID)){
      return res.status(403).json({message:"You are not a member of this team"});
    }
    res.json(team);
  }
  catch(error){
    console.log("Error in getting team by ID:", error.message);
    res.status(500).json({message:error.message});
  }
}

const applyAsTeam = async(req,res)=>{

}


module.exports = {
    createFreelancer,
    freelancerLogin,
    getAllFreelancers,
    getFreelancerByID,
    updateProfileFreelancer,
    deleteProfileFreelancer,

    getJobPosts,

    createGig,
    getGigs,
    withdrawGig,

    sendTeamInvitation,
    getTeamInvitations,
    acceptTeamInvitation,
    rejectTeamInvitation, 
    leaveTeam,
    removeMemberFromTeam,
    updateMemberRole,
    getAvailableFreelancers,
    applyForJobAsTeam,
    getTeamApplications,
    withdrawTeamApplication,

    buySubscription,
    getSubscriptionPlans,

    createTeam,
    getAllTeams,
    getTeamById,
    applyAsTeam,

    reportClient,
    getAllJobPosts,

    // Meeting controller functions
    createMeeting: createMeetingController.createMeeting,
    getMeetingsForFreelancer: createMeetingController.getMeetingsForFreelancer,
    getMeetingById: createMeetingController.getMeetingById,
    updateMeeting: createMeetingController.updateMeeting,
    deleteMeeting: createMeetingController.deleteMeeting,
};
