const { verifyToken } = require('../utils/jwt');
const { UnauthorizedError, ForbiddenError } = require('../errors/customErrors');

/**
 * Middleware to authenticate requests using JWT Bearer Token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('[API WARN] Unauthorized request - Missing or malformed Authorization header');
    return next(new UnauthorizedError('Access token is required'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.warn(`[API WARN] Unauthorized request - Invalid or expired token: ${error.message}`);
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

/**
 * Middleware to authorize access based on user roles
 * @param  {...string} allowedRoles - Roles permitted to access the endpoint
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ForbiddenError('Access denied'));
    }

    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
    const hasRole = userRoles.some(r => allowedRoles.includes(r));

    if (!hasRole) {
      console.warn(`[API WARN] Forbidden request - User ID ${req.user.id} with roles [${userRoles.join(', ')}] attempted restricted action`);
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};
