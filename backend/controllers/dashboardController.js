const Task = require('../models/Task');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    let matchQuery = {};
    
    // If not admin, only show stats for their assigned tasks
    if (req.user.role !== 'Admin') {
      matchQuery.assignedTo = req.user._id;
    }

    const totalTasks = await Task.countDocuments(matchQuery);
    const completedTasks = await Task.countDocuments({ ...matchQuery, status: 'Done' });
    const pendingTasks = await Task.countDocuments({ ...matchQuery, status: 'To Do' });
    const inProgressTasks = await Task.countDocuments({ ...matchQuery, status: 'In Progress' });
    
    const overdueTasks = await Task.countDocuments({
      ...matchQuery,
      status: { $ne: 'Done' },
      dueDate: { $lt: new Date() }
    });

    // Calculate tasks per user for Admin
    let tasksPerUser = [];
    if (req.user.role === 'Admin') {
      tasksPerUser = await Task.aggregate([
        { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        { $project: { name: { $ifNull: ["$user.name", "Unassigned"] }, count: 1, _id: 0 } },
        { $sort: { count: -1 } }
      ]);
    }

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      tasksPerUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
