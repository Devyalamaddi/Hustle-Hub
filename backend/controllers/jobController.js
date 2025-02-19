const Job = require('../models/jobSchema');
const Milestone = require('../models/mileStone.js');

const createJob = async (req, res) => {
  try {
    const { title, description, budget, milestones } = req.body;
    const clientId = req.user._id; // Assuming authenticated client

    // Create the job
    const job = await Job.create({
      title,
      description,
      budget,
      client: clientId
    });

    // Create milestones if provided
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

      await Promise.all(milestonePromises);
    }

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createJob
};
