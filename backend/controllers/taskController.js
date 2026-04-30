const Task = require('../models/Task');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Admin') {
      // Admin sees all tasks
      tasks = await Task.find()
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name');
    } else {
      // Member sees only their assigned tasks
      tasks = await Task.find({ assignedTo: req.user.id })
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name');
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate, priority } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: 'Please add title and project' });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo: assignedTo || null,
      dueDate,
      priority: priority || 'Medium',
      createdBy: req.user.id
    });

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization: Admin can update any, Member can only update assigned tasks
    if (req.user.role !== 'Admin' && (!task.assignedTo || task.assignedTo.toString() !== req.user.id)) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    const validStatuses = ['To Do', 'In Progress', 'Done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    task.status = status;
    const updatedTask = await task.save();
    
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    res.status(200).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus,
};
