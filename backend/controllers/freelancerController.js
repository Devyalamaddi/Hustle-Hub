const Freelancer = require('../models/freelancerSchema');
const Gig = require('../models/gigSchema');
const bcrypt=require('bcrypt');
const { validateFreelancer, generateToken } = require('../utils/authUtils');


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
        });
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
        res.status(500).json({ message: error.message });
    }
};

const buySubscription = async(req,res)=>{
    try{
        const {subscriptionID } = req.body;
        const userID = req.user.id;
        

    }catch(err){
        console.log("Error in buying subscription",err.message);
        return res.status(500).json({message:"Error in buying subscription"});
    }
}


module.exports = {
    createFreelancer,
    getAllFreelancers,
    getFreelancerByID,
    updateProfileFreelancer,
    deleteProfileFreelancer,
    createGig,
    freelancerLogin,
};
