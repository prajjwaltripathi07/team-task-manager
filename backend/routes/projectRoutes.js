const express = require('express');
const router = express.Router();
const { getProjects, createProject, addMemberToProject, removeMemberFromProject } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProjects).post(protect, admin, createProject);
router.route('/:id/members').post(protect, admin, addMemberToProject);
router.route('/:id/members/:userId').delete(protect, admin, removeMemberFromProject);

module.exports = router;
