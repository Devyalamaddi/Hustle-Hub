import React, { useState } from 'react';

const TeamsFreelancer = () => {
    // Initial mock data
    const initialTeams = [
        { _id: '1', name: 'Team Alpha', members: ['John', 'Jane'] },
        { _id: '2', name: 'Team Beta', members: ['Alice', 'Bob'] },
    ];

    const [teams, setTeams] = useState(initialTeams); // To store teams
    const [teamName, setTeamName] = useState('');
    const [newTeamMembers, setNewTeamMembers] = useState([]);
    const [teamIDToDelete, setTeamIDToDelete] = useState('');
    const [updatedTeamName, setUpdatedTeamName] = useState('');
    const [selectedTeamID, setSelectedTeamID] = useState('');
    const [message, setMessage] = useState('');

    // Create a new team
    const createNewTeam = () => {
        const newTeam = {
            _id: String(teams.length + 1),  // Assign a new unique ID
            name: teamName,
            members: newTeamMembers,
        };

        setTeams([...teams, newTeam]);
        setMessage('Successfully created a new team!');
    };

    // Get a team by ID
    const getTeamById = (teamID) => {
        const team = teams.find((team) => team._id === teamID);
        setMessage(JSON.stringify(team));
    };

    // Update a team by ID
    const updateTeam = () => {
        const updatedTeams = teams.map((team) =>
            team._id === selectedTeamID ? { ...team, name: updatedTeamName } : team
        );
        setTeams(updatedTeams);
        setMessage('Team updated successfully!');
    };

    // Delete a team by ID
    const deleteTeam = (teamID) => {
        const updatedTeams = teams.filter((team) => team._id !== teamID);
        setTeams(updatedTeams);
        setMessage('Team deleted successfully!');
    };

    return (
        <div>
            <h2>Teams Management (Mock Data)</h2>

            {/* Display message */}
            {message && <p>{message}</p>}

            {/* Create Team */}
            <div>
                <h3>Create New Team</h3>
                <input
                    type="text"
                    placeholder="Team Name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Team Members (comma separated)"
                    value={newTeamMembers.join(', ')}
                    onChange={(e) => setNewTeamMembers(e.target.value.split(','))}
                />
                <button onClick={createNewTeam}>Create Team</button>
            </div>

            {/* Team List */}
            <div>
                <h3>All Teams</h3>
                {teams.map((team) => (
                    <div key={team._id}>
                        <p>
                            <strong>{team.name}</strong>
                            <br />
                            Members: {team.members.join(', ')}
                        </p>
                        <button onClick={() => getTeamById(team._id)}>View Details</button>
                        <button
                            onClick={() => {
                                setSelectedTeamID(team._id);
                                setUpdatedTeamName(team.name);
                            }}
                        >
                            Edit
                        </button>
                        <button onClick={() => deleteTeam(team._id)}>Delete</button>
                    </div>
                ))}
            </div>

            {/* Update Team */}
            {selectedTeamID && (
                <div>
                    <h3>Update Team</h3>
                    <input
                        type="text"
                        placeholder="Updated Team Name"
                        value={updatedTeamName}
                        onChange={(e) => setUpdatedTeamName(e.target.value)}
                    />
                    <button onClick={updateTeam}>Update Team</button>
                </div>
            )}

            {/* Delete Team */}
            <div>
                <h3>Delete Team</h3>
                <input
                    type="text"
                    placeholder="Team ID to delete"
                    value={teamIDToDelete}
                    onChange={(e) => setTeamIDToDelete(e.target.value)}
                />
                <button onClick={() => deleteTeam(teamIDToDelete)}>Delete Team</button>
            </div>
        </div>
    );
};

export default TeamsFreelancer;
