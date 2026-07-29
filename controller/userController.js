const User = require('../models/User');

// In-memory data store for users
const usersStore = [];

const getAllUsers = (req, res) => {
  const publicUsers = usersStore.map(user => user.toJSON());
  res.status(200).json({
    success: true,
    total: publicUsers.length,
    data: publicUsers
  });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  const user = usersStore.find(u => u.id === id);

  if (!user) {
    console.warn(`[API WARN] GET /api/users/${id} - User not found`);
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: user.toJSON()
  });
};

const createUser = (req, res) => {
  try {
    const { name, birthday, email, password, role } = req.body;

    // Check if email is already registered
    const existingUser = usersStore.find(u => u.email === email?.toLowerCase().trim());
    if (existingUser) {
      console.warn(`[API WARN] POST /api/users - Email already registered: "${email}"`);
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const newUser = new User({ name, birthday, email, password, role });
    usersStore.push(newUser);

    console.log(`[API SUCCESS] POST /api/users - User created ID: ${newUser.id}`);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser.toJSON()
    });
  } catch (error) {
    console.warn(`[API VALIDATION ERROR] POST /api/users - ${error.message}`);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const user = usersStore.find(u => u.id === id);

  if (!user) {
    console.warn(`[API WARN] PUT /api/users/${id} - User not found`);
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  try {
    const { name, email, birthday } = req.body;

    if (email && email.toLowerCase().trim() !== user.email) {
      const emailTaken = usersStore.find(u => u.email === email.toLowerCase().trim());
      if (emailTaken) {
        console.warn(`[API WARN] PUT /api/users/${id} - Email already in use: "${email}"`);
        return res.status(409).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    user.updateProfile({ name, email, birthday });

    console.log(`[API SUCCESS] PUT /api/users/${id} - User updated`);

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: user.toJSON()
    });
  } catch (error) {
    console.warn(`[API VALIDATION ERROR] PUT /api/users/${id} - ${error.message}`);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  const userIndex = usersStore.findIndex(u => u.id === id);

  if (userIndex === -1) {
    console.warn(`[API WARN] DELETE /api/users/${id} - User not found`);
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  usersStore.splice(userIndex, 1);
  console.log(`[API SUCCESS] DELETE /api/users/${id} - User deleted`);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
};

const authenticateUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.warn('[API WARN] POST /api/users/login - Missing email or password');
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  const user = usersStore.find(u => u.email === email.toLowerCase().trim());

  if (!user || !user.authenticate(password)) {
    console.warn(`[API WARN] POST /api/users/login - Failed login attempt for "${email}"`);
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  console.log(`[API SUCCESS] POST /api/users/login - User authenticated ID: ${user.id}`);

  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    data: user.toJSON()
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  authenticateUser
};
