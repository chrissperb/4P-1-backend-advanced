const userService = require('../../services/userService');
const User = require('../../models/User');
const {
  NotFoundError,
  ConflictError,
  ValidationError,
  UnauthorizedError
} = require('../../errors/customErrors');

jest.mock('../../models/User');

describe('UserService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user JSON when found', async () => {
      const mockUser = {
        id: 'user-123',
        toJSON: jest.fn().mockReturnValue({ id: 'user-123', name: 'Test' })
      };
      User.findOne.mockResolvedValue(mockUser);

      const result = await userService.getUserById('user-123');

      expect(User.findOne).toHaveBeenCalledWith({ id: 'user-123' });
      expect(result).toEqual({ id: 'user-123', name: 'Test' });
    });

    it('should throw NotFoundError when user does not exist', async () => {
      User.findOne.mockResolvedValue(null);

      await expect(userService.getUserById('unknown-id')).rejects.toThrow(NotFoundError);
    });
  });

  describe('createUser', () => {
    it('should throw ConflictError if email is already taken', async () => {
      User.findOne.mockResolvedValue({ id: 'existing-id', email: 'taken@example.com' });

      await expect(
        userService.createUser({
          name: 'New User',
          birthday: '1995-01-01',
          email: 'taken@example.com',
          password: 'password123'
        })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('deleteUser', () => {
    it('should delete user when ID exists', async () => {
      User.findOneAndDelete.mockResolvedValue({ id: 'user-to-delete' });

      const result = await userService.deleteUser('user-to-delete');

      expect(User.findOneAndDelete).toHaveBeenCalledWith({ id: 'user-to-delete' });
      expect(result).toBe(true);
    });

    it('should throw NotFoundError when user to delete is not found', async () => {
      User.findOneAndDelete.mockResolvedValue(null);

      await expect(userService.deleteUser('missing-id')).rejects.toThrow(NotFoundError);
    });
  });

  describe('authenticateUser', () => {
    it('should throw ValidationError if email or password missing', async () => {
      await expect(userService.authenticateUser({ email: 'test@example.com' })).rejects.toThrow(
        ValidationError
      );
    });

    it('should throw UnauthorizedError if invalid password', async () => {
      const mockUser = {
        email: 'user@example.com',
        authenticate: jest.fn().mockReturnValue(false)
      };
      User.findOne.mockResolvedValue(mockUser);

      await expect(
        userService.authenticateUser({ email: 'user@example.com', password: 'wrongpassword' })
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});
