const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  authenticateUser
} = require('../controller/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', authenticateUser);
router.post('/', createUser);

// Protected routes (Requires valid JWT Bearer token)
router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
