const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// The assignment specifies /dashboard/admin and /dashboard/member. 
// We handle both logic in getDashboardStats based on the req.user.role.
// For strict matching we can create two routes pointing to the same controller,
// or map them specifically. Let's do both to match the required APIs precisely.

router.get('/admin', protect, getDashboardStats);
router.get('/member', protect, getDashboardStats);

module.exports = router;
