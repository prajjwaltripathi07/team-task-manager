const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTaskStatus } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTasks).post(protect, admin, createTask);
router.route('/:id/status').patch(protect, updateTaskStatus);

module.exports = router;
