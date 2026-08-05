const { generateToken, verifyToken } = require('../../utils/jwt');
const { authenticateToken, authorizeRoles } = require('../../middleware/authMiddleware');
const { UnauthorizedError, ForbiddenError } = require('../../errors/customErrors');

describe('JWT Utility & Auth Middleware Tests', () => {
  describe('JWT Utilities', () => {
    it('should generate and verify a valid JWT token', () => {
      const payload = { id: 'user-123', email: 'test@example.com', role: ['user'] };
      const token = generateToken(payload);

      expect(typeof token).toBe('string');

      const decoded = verifyToken(token);
      expect(decoded.id).toBe('user-123');
      expect(decoded.email).toBe('test@example.com');
    });
  });

  describe('authenticateToken Middleware', () => {
    it('should pass request when valid Bearer token is provided', () => {
      const token = generateToken({ id: 'user-1', email: 'a@b.com', role: ['user'] });
      const req = { headers: { authorization: `Bearer ${token}` } };
      const res = {};
      const next = jest.fn();

      authenticateToken(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user).toBeDefined();
      expect(req.user.id).toBe('user-1');
    });

    it('should call next with UnauthorizedError if authorization header is missing', () => {
      const req = { headers: {} };
      const res = {};
      const next = jest.fn();

      authenticateToken(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('should call next with UnauthorizedError if token is invalid', () => {
      const req = { headers: { authorization: 'Bearer invalid-token-string' } };
      const res = {};
      const next = jest.fn();

      authenticateToken(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('authorizeRoles Middleware', () => {
    it('should allow access if user has required role', () => {
      const req = { user: { id: 'user-1', role: ['user', 'admin'] } };
      const res = {};
      const next = jest.fn();

      authorizeRoles('admin')(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should deny access with ForbiddenError if user lacks required role', () => {
      const req = { user: { id: 'user-1', role: ['user'] } };
      const res = {};
      const next = jest.fn();

      authorizeRoles('admin')(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });
});
