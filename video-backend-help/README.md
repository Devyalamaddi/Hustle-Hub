# Video Meeting History Backend Integration

This folder contains all the necessary backend components to implement meeting history functionality for the HustleHub platform's video conferencing feature. These files are designed to be integrated into your existing Node.js/Express backend.

## Overview

The meeting history system tracks:
- Meeting details (ID, title, description, start/end times)
- Participant information (who joined, their roles, duration)
- Meeting metadata (created by, team association if applicable)

## Files Structure

- `models/meeting.js` - Mongoose schema for meeting history
- `controllers/meetingController.js` - Business logic for meeting operations
- `routes/meetingRoutes.js` - API endpoints for meeting history
- `index.js` - Integration guide for your main Express app

## Integration Steps

1. Copy these files to your backend project
2. Add the meeting routes to your Express app:

\`\`\`javascript
// In your main Express app file
const meetingRoutes = require('./path/to/video-backend-help/routes/meetingRoutes');
app.use('/api/meetings', meetingRoutes);
\`\`\`

3. Ensure MongoDB connection is established
4. Make sure your authentication middleware is properly set up

## API Endpoints

### GET `/api/meetings`
- **Description**: Fetch all meetings for the authenticated user
- **Auth**: Required
- **Query Parameters**:
  - `limit`: Number of results (default: 10)
  - `page`: Page number (default: 1)
  - `role`: Filter by role (optional)

### GET `/api/meetings/:id`
- **Description**: Get details of a specific meeting
- **Auth**: Required
- **URL Parameters**:
  - `id`: Meeting ID

### POST `/api/meetings`
- **Description**: Create a new meeting record
- **Auth**: Required
- **Request Body**:
  \`\`\`json
  {
    "title": "Meeting Title",
    "description": "Meeting Description",
    "startTime": "2023-04-24T10:00:00Z",
    "endTime": "2023-04-24T11:00:00Z",
    "participants": [
      {
        "userId": "user_id_from_localStorage",
        "role": "role_from_localStorage",
        "joinTime": "2023-04-24T10:00:00Z",
        "leaveTime": "2023-04-24T11:00:00Z"
      }
    ],
    "teamId": "team_id_if_applicable"
  }
  \`\`\`

### PUT `/api/meetings/:id`
- **Description**: Update meeting details or add participants
- **Auth**: Required
- **URL Parameters**:
  - `id`: Meeting ID
- **Request Body**: Same as POST but with updated fields

### DELETE `/api/meetings/:id`
- **Description**: Delete a meeting record
- **Auth**: Required
- **URL Parameters**:
  - `id`: Meeting ID

## Schema Details

### Meeting Schema
\`\`\`javascript
{
  title: String,
  description: String,
  roomId: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startTime: Date,
  endTime: Date,
  duration: Number, // in minutes
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: String, // 'freelancer' or 'client'
      joinTime: Date,
      leaveTime: Date,
      duration: Number // in minutes
    }
  ],
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }, // if applicable
  status: String, // 'scheduled', 'in-progress', 'completed', 'cancelled'
  recordingUrl: String, // if recording is enabled
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Frontend Integration

The backend is designed to work with the existing Jitsi integration. When a meeting ends, the frontend should:

1. Collect participant data from localStorage
2. Send a POST request to `/api/meetings` with meeting details
3. For each participant that joins/leaves, send a PUT request to update the meeting

Example frontend code for ending a meeting:

\`\`\`javascript
// When meeting ends
const endMeeting = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem('role');
  
  if (!user || !user.id) return;
  
  const meetingData = {
    title: "Meeting Title",
    description: "Meeting Description",
    roomId: "current-room-id",
    startTime: meetingStartTime,
    endTime: new Date(),
    participants: [
      {
        userId: user.id,
        role: role,
        joinTime: meetingStartTime,
        leaveTime: new Date()
      }
    ]
  };
  
  try {
    await fetch('/api/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(meetingData)
    });
  } catch (error) {
    console.error('Failed to save meeting history:', error);
  }
};
\`\`\`

## Security Considerations

- All endpoints require authentication
- Users can only access meetings they participated in
- Role-based access control is implemented for team meetings

## Dependencies

- MongoDB/Mongoose
- Express.js
- JWT for authentication (or your existing auth system)

## Troubleshooting

If you encounter issues:

1. Check MongoDB connection
2. Verify authentication middleware is working
3. Ensure proper error handling in API requests
4. Check console logs for detailed error messages

For additional support, please refer to the main documentation or contact the development team.
