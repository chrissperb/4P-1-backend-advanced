const User = require('../models/User');
const {
  NotFoundError,
  ConflictError,
  ValidationError,
  UnauthorizedError
} = require('../errors/customErrors');

class UserService {
  async getAllUsers() {
    const users = await User.find();
    return users.map(user => user.toJSON());
  }

  async getUserById(id) {
    const user = await User.findOne({ id });
    if (!user) {
      console.warn(`[API WARN] GET /api/users/${id} - User not found`);
      throw new NotFoundError('User not found');
    }
    return user.toJSON();
  }

  async createUser({ name, birthday, email, password, role }) {
    const normalizedEmail = email?.toLowerCase().trim();

    // Check if email is already registered
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.warn(`[API WARN] POST /api/users - Email already registered: "${email}"`);
      throw new ConflictError('Email already registered');
    }

    try {
      const newUser = new User({ name, birthday, email, password, role });
      await newUser.save();

      console.log(`[API SUCCESS] POST /api/users - User created ID: ${newUser.id}`);
      return newUser.toJSON();
    } catch (error) {
      console.warn(`[API VALIDATION ERROR] POST /api/users - ${error.message}`);
      throw new ValidationError(error.message);
    }
  }

  async updateUser(id, { name, email, birthday }) {
    const user = await User.findOne({ id });
    if (!user) {
      console.warn(`[API WARN] PUT /api/users/${id} - User not found`);
      throw new NotFoundError('User not found');
    }

    if (email && email.toLowerCase().trim() !== user.email) {
      const emailTaken = await User.findOne({ email: email.toLowerCase().trim() });
      if (emailTaken) {
        console.warn(`[API WARN] PUT /api/users/${id} - Email already in use: "${email}"`);
        throw new ConflictError('Email already in use');
      }
    }

    try {
      user.updateProfile({ name, email, birthday });
      await user.save();
      console.log(`[API SUCCESS] PUT /api/users/${id} - User updated`);
      return user.toJSON();
    } catch (error) {
      console.warn(`[API VALIDATION ERROR] PUT /api/users/${id} - ${error.message}`);
      throw new ValidationError(error.message);
    }
  }

  async deleteUser(id) {
    const user = await User.findOneAndDelete({ id });
    if (!user) {
      console.warn(`[API WARN] DELETE /api/users/${id} - User not found`);
      throw new NotFoundError('User not found');
    }

    console.log(`[API SUCCESS] DELETE /api/users/${id} - User deleted`);
    return true;
  }

  async authenticateUser({ email, password }) {
    if (!email || !password) {
      console.warn('[API WARN] POST /api/users/login - Missing email or password');
      throw new ValidationError('Email and password are required');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.authenticate(password)) {
      console.warn(`[API WARN] POST /api/users/login - Failed login attempt for "${email}"`);
      throw new UnauthorizedError('Invalid credentials');
    }

    console.log(`[API SUCCESS] POST /api/users/login - User authenticated ID: ${user.id}`);
    return user.toJSON();
  }
}

module.exports = new UserService();
