const request = require('supertest');
const app = require('../../app');
const userService = require('../../services/userService');
const { generateToken } = require('../../utils/jwt');
const { NotFoundError, ConflictError, UnauthorizedError } = require('../../errors/customErrors');

jest.mock('../../services/userService');

describe('User Routes Integration Tests', () => {
  let validToken;

  beforeEach(() => {
    jest.clearAllMocks();
    validToken = generateToken({ id: 'user-1', email: 'alice@example.com', role: ['user'] });
  });

  describe('GET /', () => {
    it('should return health check status 200 without token', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('online');
    });
  });

  describe('GET /api/users', () => {
    it('should return 401 Unauthorized if token is missing', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return list of users with 200 OK when valid Bearer token provided', async () => {
      const mockUsers = [{ id: '1', name: 'Alice' }];
      userService.getAllUsers.mockReturnValue(mockUsers);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.total).toBe(1);
      expect(response.body.data).toEqual(mockUsers);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user with 200 OK when valid token and existing ID', async () => {
      const mockUser = { id: 'user-1', name: 'Alice' };
      userService.getUserById.mockReturnValue(mockUser);

      const response = await request(app)
        .get('/api/users/user-1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockUser);
    });

    it('should return 404 Not Found when user does not exist', async () => {
      userService.getUserById.mockImplementation(() => {
        throw new NotFoundError('User not found');
      });

      const response = await request(app)
        .get('/api/users/missing-id')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('POST /api/users', () => {
    it('should create user and return 201 Created (Public Endpoint)', async () => {
      const newUser = { id: 'created-1', name: 'Bob', email: 'bob@example.com' };
      userService.createUser.mockReturnValue(newUser);

      const response = await request(app)
        .post('/api/users')
        .send({
          name: 'Bob',
          birthday: '1990-01-01',
          email: 'bob@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.data).toEqual(newUser);
    });

    it('should return 409 Conflict when email is already registered', async () => {
      userService.createUser.mockImplementation(() => {
        throw new ConflictError('Email already registered');
      });

      const response = await request(app)
        .post('/api/users')
        .send({
          name: 'Bob',
          birthday: '1990-01-01',
          email: 'bob@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already registered');
    });
  });

  describe('POST /api/users/login', () => {
    it('should return 200 OK with user profile and JWT token on successful authentication', async () => {
      const mockResult = {
        user: { id: 'user-1', email: 'bob@example.com' },
        token: 'mock.jwt.token'
      };
      userService.authenticateUser.mockReturnValue(mockResult);

      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'bob@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Authentication successful');
      expect(response.body.data.token).toBe('mock.jwt.token');
    });

    it('should return 401 Unauthorized on invalid credentials', async () => {
      userService.authenticateUser.mockImplementation(() => {
        throw new UnauthorizedError('Invalid credentials');
      });

      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'bob@example.com', password: 'wrong' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should return 200 OK on successful deletion when authenticated', async () => {
      userService.deleteUser.mockReturnValue(true);

      const response = await request(app)
        .delete('/api/users/user-1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User deleted successfully');
    });
  });
});
