const Meeting = require('../models/meeting');

// Record meeting activity (join/leave)
exports.recordMeetingActivity = async (req, res) => {
  try {
    const { roomId, meetingId, userId, userRole, action, timestamp } = req.body;
    
    if (!roomId || !meetingId || !userId || !userRole || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (action !== 'joined' && action !== 'left') {
      return res.status(400).json({ error: 'Invalid action' });
    }
    
    const actionTime = timestamp ? new Date(timestamp) : new Date();
    
    // Find existing meeting or create a new one
    let meeting = await Meeting.findOne({ meetingId, isActive: true });
    
    if (action === 'joined') {
      if (!meeting) {
        // Create new meeting if it doesn't exist
        meeting = new Meeting({
          meetingId,
          roomId,
          startTime: actionTime,
          participants: [{
            userId,
            userRole,
            joinTime: actionTime
          }]
        });
      } else {
        // Check if user is already in the meeting
        const existingParticipant = meeting.participants.find(p => 
          p.userId === userId && !p.leaveTime
        );
        
        if (!existingParticipant) {
          // Add user to participants
          meeting.participants.push({
            userId,
            userRole,
            joinTime: actionTime
          });
        }
      }
    } else if (action === 'left') {
      if (!meeting) {
        return res.status(404).json({ error: 'Meeting not found' });
      }
      
      // Find the participant and update leave time
      const participantIndex = meeting.participants.findIndex(p => 
        p.userId === userId && !p.leaveTime
      );
      
      if (participantIndex !== -1) {
        meeting.participants[participantIndex].leaveTime = actionTime;
      }
      
      // Check if all participants have left
      const allLeft = meeting.participants.every(p => p.leaveTime);
      if (allLeft) {
        meeting.isActive = false;
        meeting.endTime = actionTime;
      }
    }
    
    await meeting.save();
    
    return res.status(200).json({ 
      success: true, 
      message: `User ${action} the meeting successfully` 
    });
  } catch (error) {
    console.error('Error recording meeting activity:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get meeting history for a user
exports.getMeetingHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Find all meetings where the user was a participant
    const meetings = await Meeting.find({
      'participants.userId': userId
    }).sort({ startTime: -1 });
    
    return res.status(200).json(meetings);
  } catch (error) {
    console.error('Error fetching meeting history:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get meeting details
exports.getMeetingDetails = async (req, res) => {
  try {
    const { meetingId } = req.params;
    
    if (!meetingId) {
      return res.status(400).json({ error: 'Meeting ID is required' });
    }
    
    const meeting = await Meeting.findOne({ meetingId });
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    
    return res.status(200).json(meeting);
  } catch (error) {
    console.error('Error fetching meeting details:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Update meeting title
exports.updateMeetingTitle = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { title } = req.body;
    
    if (!meetingId) {
      return res.status(400).json({ error: 'Meeting ID is required' });
    }
    
    const meeting = await Meeting.findOne({ meetingId });
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    
    meeting.title = title;
    await meeting.save();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Meeting title updated successfully' 
    });
  } catch (error) {
    console.error('Error updating meeting title:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
