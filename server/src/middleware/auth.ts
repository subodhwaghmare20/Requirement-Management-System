import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import { User, IUser, UserRole } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticateUser = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // 1. Check HTTP-only cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Fallback to Bearer token header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in. Please log in to gain access.', 401)
      );
    }

    const jwtSecret =
      process.env.JWT_SECRET || 'super_secret_jwt_key_external_job_portal_2026';
    const decoded = jwt.verify(token, jwtSecret) as { id: string; role: UserRole };

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    if (!currentUser.isActive) {
      return next(
        new AppError('Your account has been deactivated or suspended.', 403)
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired authentication token', 401));
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          `User role '${req.user?.role || 'GUEST'}' is not authorized to access this resource`,
          403
        )
      );
    }
    next();
  };
};

// Aliases for compatibility
export const protect = authenticateUser;
export const authorize = requireRole;
