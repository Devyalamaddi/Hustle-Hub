const jwt = require('jsonwebtoken');
const Client = require('../models/clientSchema');
const Freelancer = require('../models/freelancerSchema');
const bcrypt = require('bcrypt');
require('dotenv').config();


// Generate JWT token
const generateToken = async(userId) => {
  let user = await Client.findById(userId);
  if(!user){
    user = await Freelancer.findById(userId);
  }
  if (!user) {
    throw new Error('User not found');
  }
  console.log(user)
  user.password=undefined;
  const token = await jwt.sign({ 
    id: userId, 
    role: user.role,
    data: user
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
  return token;
};

// Validate client credentials
const validateClient = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const client = await Client.findOne({ email });
    if (!client) {
    throw new Error('Invalid credentials');

  }

  const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
    throw new Error('Invalid credentials');

  }

  return client;
};

// Validate freelancer credentials
const validateFreelancer = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const freelancer = await Freelancer.findOne({ email });
    if (!freelancer) {
    throw new Error('Invalid credentials');

  }

  const isMatch = await bcrypt.compare(password, freelancer.password);
    if (!isMatch) {
    throw new Error('Invalid credentials');

  }

  return freelancer;
};

// Middleware to verify JWT and attach user to request
const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // console.log(token)
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    // console.log("end of protect Function")
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Role-based middleware functions
const clientOnly = (req, res, next) => {
  if (req.user.role !== 'client') {
    return res.status(403).json({ message: 'Access restricted to clients only' });
  }
  // console.log("end of cleintOnly");
  next();
};

const freelancerOnly = (req, res, next) => {
  // console.log("req in freelancer",req);
  if (req.user.role !== 'freelancer') {
    return res.status(403).json({ message: 'Access restricted to freelancers only' });
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access restricted to admins only' });
  }
  next();
};

module.exports = {
  generateToken,
  validateClient,
  validateFreelancer,
  protect,
  clientOnly,
  freelancerOnly,
  adminOnly
};
