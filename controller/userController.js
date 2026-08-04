const userService = require('../services/userService');
const { AppError } = require('../errors/customErrors');

const getAllUsers = (req, res, next) => {
  try {
    const users = userService.getAllUsers();
    res.status(200).json({
      success: true,
      total: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = (req, res, next) => {
  try {
    const { id } = req.params;
    const user = userService.getUserById(id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

const createUser = (req, res, next) => {
  try {
    const newUser = userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

const updateUser = (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = userService.updateUser(id, req.body);
    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

const deleteUser = (req, res, next) => {
  try {
    const { id } = req.params;
    userService.deleteUser(id);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

const authenticateUser = (req, res, next) => {
  try {
    const user = userService.authenticateUser(req.body);
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: user
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  authenticateUser
};
