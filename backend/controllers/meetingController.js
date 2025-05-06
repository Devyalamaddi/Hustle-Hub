const Meeting = require('../models/meetingModel');

// Create a new meeting
const createMeeting = async (req, res) => {
  try {
    const { title, freelancerID, clientID, clientMeetLink, freelancerMeetLink, date, time} = req.body;
    if (!title || !freelancerID || !clientID || !clientMeetLink || !freelancerMeetLink || !date || !time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const meeting = new Meeting({
      title,
      freelancerID,
      clientID,
      clientMeetLink,
      freelancerMeetLink,
      date,
      time
    });
    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all meetings for a freelancer
const getMeetingsForFreelancer = async (req, res) => {
  try {
    const freelancerID = req.user.id;
    const meetings = await Meeting.find({ freelancerID }).populate('clientID').populate('freelancerID');
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a meeting by ID
const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a meeting by ID
const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a meeting by ID
const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMeeting,
  getMeetingsForFreelancer,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
};
