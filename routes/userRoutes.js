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

// Routes definitions for REST API
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.post('/login', authenticateUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
