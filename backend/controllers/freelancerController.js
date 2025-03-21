const Freelancer = require('../models/freelancerSchema');
const Gig = require('../models/gigSchema');
const bcrypt=require('bcrypt');
const { validateFreelancer, generateToken } = require('../utils/authUtils');
const SubscriptionPlan = require('../models/subscriptionPlanSchema');
const Client = require('../models/clientSchema');
const Team = require('../models/teamSchema');
const Job = require('../models/jobSchema');


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
        const { jobID, title, description, status } = req.body;
        const userID=req.user.id;
        
        
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

const createTeam = async(req,res)=>{
    try{
        let {teamName, teamMembers} = req.body;
        const freelancerID = req.user.id;
        teamMembers=[...teamMembers,freelancerID]
        const team = await Team.create({
            "name":teamName,
            "members":teamMembers,
        });
        return res.status(201).json({"message":"Succesfully created a new team","team":team});
    }catch(err){
        console.log("Error in creating Team by freelancer: ", err.message);
        return res.status(500).json({message:err.message});
    }
}

const getAllTeams = async(req,res)=>{
    try{
        const freelancerID=req.user.id;
        const teams = await Team.find({
            members:freelancerID,
        })
        return res.status(201).json(teams);
    }catch(err){
        console.log("Error in getting all teams", err.message);
        return res.status(500).json("Error in getting all teams");
    }
}

const getTeamByID = async(req,res)=>{
    try{
        const {teamID} = req.params;
        const team = await Team.findById(teamID);
        return res.json(team);
    }catch(err){
        console.log("Error in getting team by id", err.message);
        return res.status(500).json("Error in getting team by id");
    }
}

const getJobPosts = async(req,res)=>{
    try{
        const jobPosts = await Job.find({}).populate('clientId');
        return res.json(jobPosts);
    }catch(err){
        console.log("Error in getting job posts",err.message);
        return res.status(500).json({message:"Error in getting job posts"});
    }
}

const updateTeam =async(req,res)=>{
    try{
        const {teamID} = req.params;
        const {updatedDetails} = req.body;
        if(updatedDetails){
            updatedDetails.name=updatedDetails.teamName;
            delete updatedDetails.teamName;
        }

        const updatedTeam = await Team.findByIdAndUpdate(
            teamID,
            updatedDetails,
            {new:true}
        )

        return res.status(201).json(updatedTeam);

    }catch(err){
        console.log("Error in updating the team details ", err.message);
        return res.status(500).json("Error in updating the team details");
    }
}

const deleteTeamByID = async(req,res)=>{
    try{
        const {teamID} = req.params;
        const deletedTeam = await Team.findByIdAndDelete(teamID);

        return res.status(200).json(deletedTeam);
    }catch(err){
        console.log("Error in deleting the team",err.message);
        return res.status(500).json("Error in deleteing the team");
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

    createTeam,
    getAllTeams,
    getTeamByID,
    updateTeam,
    deleteTeamByID,

    buySubscription,
    getSubscriptionPlans,

    reportClient,
};
