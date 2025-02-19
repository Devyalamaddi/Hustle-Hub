const Admin = require('../models/adminSchema');
const Client = require('../models/clientSchema');
const Freelancer = require('../models/freelancerSchema');

// Update subscription plans
exports.updateSubscriptionPlans = async (req, res) => {
  try {
    const { plans } = req.body;
    const admin = await Admin.findOne();
    admin.subscriptionPlans = plans;
    await admin.save();
    res.status(200).json({ message: 'Subscription plans updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Report a user
exports.reportUser = async (req, res) => {
  try {
    const { reportedUserId, reporterId, reason, userType } = req.body;
    const admin = await Admin.findOne();
    
    admin.fraudReports.push({
      reportedUser: reportedUserId,
      reportedUserModel: userType === 'client' ? 'Client' : 'Freelancer',
      reporter: reporterId,
      reporterModel: userType === 'client' ? 'Freelancer' : 'Client',
      reason
    });

    await admin.save();

    // Check if user should be disabled
    const reportsCount = admin.fraudReports.filter(
      report => report.reportedUser.toString() === reportedUserId
    ).length;

    if (reportsCount >= 10) {
      admin.disabledUsers.push({
        user: reportedUserId,
        userModel: userType === 'client' ? 'Client' : 'Freelancer'
      });

      await admin.save();

      // Update user status
      if (userType === 'client') {
        await Client.findByIdAndUpdate(reportedUserId, { status: false });
      } else {
        await Freelancer.findByIdAndUpdate(reportedUserId, { status: false });
      }
    }

    res.status(200).json({ message: 'User reported successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get disabled users
exports.getDisabledUsers = async (req, res) => {
  try {
    const admin = await Admin.findOne().populate('disabledUsers.user');
    res.status(200).json(admin.disabledUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
