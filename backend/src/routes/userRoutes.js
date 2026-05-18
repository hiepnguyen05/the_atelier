const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All user routes require admin privileges
router.use(protect);
router.use(authorize('admin'));

router.get('/', userController.getAllUsers);
router.put('/:id/status', userController.toggleUserStatus);
router.put('/:id/role', userController.updateUserRole);

module.exports = router;
