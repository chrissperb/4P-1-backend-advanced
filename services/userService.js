const User = require('../models/User');
const {
  NotFoundError,
  ConflictError,
  ValidationError,
  UnauthorizedError
} = require('../errors/customErrors');

// In-memory data store for users
const usersStore = [];

class UserService {
  getAllUsers() {
    return usersStore.map(user => user.toJSON());
  }

  getUserById(id) {
    const user = usersStore.find(u => u.id === id);
    if (!user) {
      console.warn(`[API WARN] GET /api/users/${id} - User not found`);
      throw new NotFoundError('User not found');
    }
    return user.toJSON();
  }

  createUser({ name, birthday, email, password, role }) {
    const normalizedEmail = email?.toLowerCase().trim();

    // Check if email is already registered
    const existingUser = usersStore.find(u => u.email === normalizedEmail);
    if (existingUser) {
      console.warn(`[API WARN] POST /api/users - Email already registered: "${email}"`);
      throw new ConflictError('Email already registered');
    }

    try {
      const newUser = new User({ name, birthday, email, password, role });
      usersStore.push(newUser);

      console.log(`[API SUCCESS] POST /api/users - User created ID: ${newUser.id}`);
      return newUser.toJSON();
    } catch (error) {
      console.warn(`[API VALIDATION ERROR] POST /api/users - ${error.message}`);
      throw new ValidationError(error.message);
    }
  }

  updateUser(id, { name, email, birthday }) {
    const user = usersStore.find(u => u.id === id);
    if (!user) {
      console.warn(`[API WARN] PUT /api/users/${id} - User not found`);
      throw new NotFoundError('User not found');
    }

    if (email && email.toLowerCase().trim() !== user.email) {
      const emailTaken = usersStore.find(u => u.email === email.toLowerCase().trim());
      if (emailTaken) {
        console.warn(`[API WARN] PUT /api/users/${id} - Email already in use: "${email}"`);
        throw new ConflictError('Email already in use');
      }
    }

    try {
      user.updateProfile({ name, email, birthday });
      console.log(`[API SUCCESS] PUT /api/users/${id} - User updated`);
      return user.toJSON();
    } catch (error) {
      console.warn(`[API VALIDATION ERROR] PUT /api/users/${id} - ${error.message}`);
      throw new ValidationError(error.message);
    }
  }

  deleteUser(id) {
    const userIndex = usersStore.findIndex(u => u.id === id);
    if (userIndex === -1) {
      console.warn(`[API WARN] DELETE /api/users/${id} - User not found`);
      throw new NotFoundError('User not found');
    }

    usersStore.splice(userIndex, 1);
    console.log(`[API SUCCESS] DELETE /api/users/${id} - User deleted`);
    return true;
  }

  authenticateUser({ email, password }) {
    if (!email || !password) {
      console.warn('[API WARN] POST /api/users/login - Missing email or password');
      throw new ValidationError('Email and password are required');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = usersStore.find(u => u.email === normalizedEmail);

    if (!user || !user.authenticate(password)) {
      console.warn(`[API WARN] POST /api/users/login - Failed login attempt for "${email}"`);
      throw new UnauthorizedError('Invalid credentials');
    }

    console.log(`[API SUCCESS] POST /api/users/login - User authenticated ID: ${user.id}`);
    return user.toJSON();
  }
}

module.exports = new UserService();
