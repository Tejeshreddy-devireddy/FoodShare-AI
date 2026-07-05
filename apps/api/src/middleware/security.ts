import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Standard rate limiter for API endpoints
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

// Stricter rate limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 signups/logins per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login or registration attempts. Please try again in an hour.',
  },
});

// XSS Protection middleware to sanitize request inputs
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (val: any): any => {
    if (typeof val === 'string') {
      return val.replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, '')
                .replace(/<\/?[^>]+(>|$)/g, ''); // Simple strip tags
    } else if (Array.isArray(val)) {
      return val.map(sanitize);
    } else if (typeof val === 'object' && val !== null) {
      const cleanObj: any = {};
      for (const key in val) {
        cleanObj[key] = sanitize(val[key]);
      }
      return cleanObj;
    }
    return val;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);

  next();
};
