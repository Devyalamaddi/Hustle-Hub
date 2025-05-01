const Client = require('../models/clientSchema');
const Job = require('../models/jobSchema');
const Milestone = require('../models/mileStone.js');
const Gig = require('../models/gigSchema');
const bcrypt = require('bcrypt');
const { generateToken, validateClient } = require('../utils/authUtils');
const SubscriptionPlan = require('../models/subscriptionPlanSchema');
const Freelancer = require('../models/freelancerSchema.js');

const meetingController = require('./meetingController');

const createClient = async (req, res) => {
    try {
        const { name, email, password, companyName, industry, contactInfo } = req.body;
        
        if (!companyName || !industry || !contactInfo) {
            return res.status(400).json({ error: 'Company name,industry and contact-info are required' });
        }

        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        const hashedpassword = await bcrypt.hash(password,10);
        req.body.password=hashedpassword;
        
        const client = new Client({
            ...req.body,
            role: 'client'
        });

        await client.save();
        res.status(201).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const clientLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const client = await validateClient(email, password);
        if (client) {
            const token = await generateToken(client._id);
            console.log("token",token);
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find({ role: 'client' });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllClientsByID = async (req, res) => {
    try {
        const client = await Client.findOne({ 
            _id: req.params.id,
            role: 'client'
        });
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProfileClient = async (req, res) => {
    try {
        console.log("entering");
        const updatedClient = await Client.findOneAndUpdate(
            { _id: req.params.id, role: 'client' },
            req.body,
            { new: true }
        );

        // console.log("Updated",updatedClient);

        if (!updatedClient) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(updatedClient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteProfileClient = async (req, res) => {
    try {
        const deletedClient = await Client.findOneAndDelete({
            _id: req.params.id,
            role: 'client'
        });
        if (!deletedClient) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const createJob = async (req, res) => {
    try {
        const { title, description, budget, type, status, teamRequired, milestones } = req.body;
        const clientId = req.user.id; 
        // console.log("clientId:",req.user);
        // Step 1: Create the job without milestones
        const job = await Job.create({
            title,
            description,
            clientId,
            budget,
            type,
            status,
            teamRequired
        });

        // Step 2: Create milestones and store their IDs
        let milestoneIds = [];
        if (milestones && milestones.length > 0) {
            const milestonePromises = milestones.map(milestone => {
                return Milestone.create({
                    jobId: job._id,
                    title: milestone.title,
                    description: milestone.description,
                    amount: milestone.amount,
                    dueDate: milestone.dueDate,
                    createdBy: clientId
                });
            });

            const createdMilestones = await Promise.all(milestonePromises);
            milestoneIds = createdMilestones.map(milestone => milestone._id);
        }

        // Step 3: Update the job with milestone IDs
        job.milestones = milestoneIds;
        await job.save();

        // Step 4: Populate the job with milestones before sending response
        const populatedJob = await Job.findById(job._id).populate("milestones");

        res.status(201).json({
            success: true,
            data: populatedJob
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};



const getAllJobs = async (req, res) => {
    try {
        const clientID = req.user.id;
        const jobs = await Job.find({
            clientId: clientID,
        })
        .populate({
            path: "freelancers",
            select: "-password",
        })
        .populate("milestones"); 
               
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate(["milestones","clientId","freelancers"]);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateJob = async (req, res) => {
    console.log("Enterning");
    try {
        // console.log("passing")
        const updatedJob = await Job.findByIdAndUpdate(
            {_id:req.params.id},
            req.body,
            { new: true }
        );
        // console.log("passing")
        if (!updatedJob) {
            return res.status(404).json({ error: 'Job not found' });
        }
        // console.log("passing")
        res.json(updatedJob);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log("Error in updating job",error.message);
    }
};

const deleteJob = async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (!deletedJob) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getGigsByJob = async (req, res) => {
    try {
        const { jobID } = req.params;
        // const { freelancerID } = req.query;

        // Get all gigs for the job
        const gigs = await Gig.find({ jobID });

        res.status(200).json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const finaliseFreelancer = async (req, res) => {
    try {
        const { jobID, freelancerID } = req.params;
        console.log(jobID, freelancerID);

        // Get all gigs for the job
        const gig = await Gig.findOneAndUpdate(
            { $and: [{ jobID }, { userID: freelancerID }] }, 
            { $set: { status: "accepted" } },
            { new: true } 
        );
        
          
        // If freelancerID is provided, update the job
        if (freelancerID) {
            await Job.findByIdAndUpdate(jobID, {
                $push: { freelancers: freelancerID }
            });
        }

        res.status(200).json(gig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getSubscriptionPlansForClients = async(req,res)=>{
    try {
        const subscriptionPlans = await SubscriptionPlan.find({for:"client"});
        return res.json(subscriptionPlans);
    } catch (error) {
        console.log("Error in getting the Subcriptions", error.message);
        return res.status(500).json({ error: error.message });
    }
}


const buySubscription = async(req,res)=>{
    try{
        const {subscriptionPlanID } = req.params;
        // console.log("Hi")
        const clientID = req.user.id;
        // console.log(subscriptionPlanID);
        const subscriptionPlan = await SubscriptionPlan.findById({_id:subscriptionPlanID});
        if(!subscriptionPlan){
            return res.status(404).json({message:'subscription not found'});
        }
        // console.log(subscriptionPlan);

        const client = await Client.findByIdAndUpdate(
            {_id:clientID}, 
            { 
                $set: { 
                    subscriptionId: subscriptionPlanID, 
                    subscriptionDurationInDays: subscriptionPlan.duration, 
                    subscriptionStatus: true 
                } 
            },
            { new: true } // This ensures the updated document is returned
        );

        // console.log("hiepojoiinoi",client)
        return res.status(201).json(client);
    }catch(err){
        console.log("Error in buying subscription",err.message);
        return res.status(500).json({message:"Error in buying subscription"});
    }
}

const reportFreelancer = async(req,res)=>{
    try{
        const {freelancerID} = req.params;
        // const clientID = req.user.id;
        const freelancer = await Freelancer.findByIdAndUpdate(freelancerID,
            {
                $inc: { reportedCount: 1 }
            },
            {
                new: true,
            }
        );

        return res.status(200).json(freelancer);
    }catch(err){
        console.log("Error at reporting freelancer: ",err.message);
        return res.status(500).json({message:"Error at reporting freelancer"});
    }
}

const updateMilestone = async (req, res) => {
    const { jobId, milestoneId } = req.params;
    const { status } = req.body;
    // console.log("entering");

    try {
        // Find the job
        const job = await Job.findById(jobId).populate("milestones");
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        // console.log("passing")

        // Find the milestone
        // console.log(job.milestones);
        const milestone = job.milestones.find(milestone => milestone._id.toString() === milestoneId);
        if (!milestone) {
            return res.status(404).json({ message: 'Milestone not found' });
        }
        // console.log("passing")

        // Update the milestone
        milestone.status=status;
        milestone.updatedAt = Date.now();
        // console.log("passing")

        await job.save();
        res.status(200).json({ message: 'Milestone updated successfully', job });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}


module.exports = {
    createClient,
    clientLogin,
    getAllClients,
    getAllClientsByID,
    updateProfileClient,
    deleteProfileClient,
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getGigsByJob,
    finaliseFreelancer,
    getSubscriptionPlansForClients,
    buySubscription,
    reportFreelancer,
    updateMilestone,

    // Meeting controller functions
    createMeeting: meetingController.createMeeting,
    getMeetingsForClient: async (req, res) => {
      try {
        const clientID = req.user.id;
        const meetings = await require('../models/meetingModel').find({ clientID });
        res.json(meetings);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
    getMeetingById: meetingController.getMeetingById,
    updateMeeting: meetingController.updateMeeting,
    deleteMeeting: meetingController.deleteMeeting,
};
