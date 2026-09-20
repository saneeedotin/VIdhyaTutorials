import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    schoolCode: string;
    sectionId?: string;
    batchId?: string;
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vidhya_tutorials_super_secret_jwt_2026_key') as any;
    req.user = {
      id: decoded.sub,
      role: decoded.role,
      schoolCode: decoded.schoolCode,
      sectionId: decoded.sectionId,
      batchId: decoded.batchId,
    };
    
    // Implement impersonation check if admin
    const impersonateId = req.headers['x-impersonate-userid'] as string;
    if (impersonateId && req.user.role === 'ADMIN') {
      // For now, we'll just log it. A full implementation would fetch the impersonated user's role/section.
      console.log(`Admin ${req.user.id} impersonating ${impersonateId}`);
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

export const requireRole = (...roles: (string | string[])[]) => {
  const flatRoles = roles.flat();
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !flatRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: requires one of [${flatRoles.join(', ')}] role` });
    }
    next();
  };
};

export const requireSection = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  
  if (req.user.role === 'ADMIN') {
    return next(); // Admins bypass section scope
  }
  
  const targetSectionId = req.params.sectionId || req.body.sectionId || req.query.sectionId;
  
  if (targetSectionId && req.user.sectionId && targetSectionId !== req.user.sectionId) {
    return res.status(403).json({ error: 'Forbidden: You do not have access to this section' });
  }
  
  next();
};
