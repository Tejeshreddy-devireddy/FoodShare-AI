import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (process.env.NODE_ENV === 'production') {
  if (!JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. Refusing to start.');
  }
  if (!JWT_REFRESH_SECRET) {
    throw new Error('FATAL: JWT_REFRESH_SECRET environment variable is not set. Refusing to start.');
  }
}

const effectiveSecret = JWT_SECRET || 'supersecretjwtkeyforfoodsharedevelopment';
const effectiveRefreshSecret = JWT_REFRESH_SECRET || 'supersecretjwtrefreshkeyforfoodsharedevelopment';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'Admin' | 'Donor' | 'NGO' | 'Volunteer' | 'Government' | 'CSR Team';
    email: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, effectiveSecret, (err, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };
    next();
  });
};

export const requireRoles = (roles: Array<'Admin' | 'Donor' | 'NGO' | 'Volunteer' | 'Government' | 'CSR Team'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }

    next();
  };
};

export const generateAccessToken = (payload: { id: string; role: string; email: string }) => {
  return jwt.sign(payload, effectiveSecret, { expiresIn: '1d' });
};

export const generateRefreshToken = (payload: { id: string; role: string; email: string }) => {
  return jwt.sign(payload, effectiveRefreshSecret, { expiresIn: '7d' });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, effectiveRefreshSecret);
};
