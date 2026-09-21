import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getAuth, isFirebaseActive } from '../db/firebase';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    schoolCode: string;
    sectionId?: string;
    batchId?: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    // 1. Try Firebase ID token verification if Firebase Auth is active
    if (isFirebaseActive()) {
      const auth = getAuth();
      if (auth) {
        try {
          const decodedFirebase = await auth.verifyIdToken(token);
          req.user = {
            id: decodedFirebase.uid,
            role: (decodedFirebase.role as string) || 'STUDENT',
            schoolCode: (decodedFirebase.schoolCode as string) || 'VIDHYA',
            sectionId: decodedFirebase.sectionId as string | undefined,
            batchId: decodedFirebase.batchId as string | undefined,
          };

          // Admin impersonation check
          const impersonateId = req.headers['x-impersonate-userid'] as string;
          if (impersonateId && req.user.role === 'ADMIN') {
            console.log(`Admin ${req.user.id} impersonating ${impersonateId}`);
          }

          return next();
        } catch {
          // Token is not a Firebase ID Token, proceed to JWT verification
        }
      }
    }

    // 2. Standard application JWT verification
    const jwtSecret = process.env.JWT_SECRET || 'QWLpXsASexuc8GL_gRujXlLE9f0nJZ-xArE27r7hLQQ3r7To2ycT8690Efp7zZ0K';

    const decoded = jwt.verify(token, jwtSecret) as any;
    req.user = {
      id: decoded.sub,
      role: decoded.role,
      schoolCode: decoded.schoolCode,
      sectionId: decoded.sectionId,
      batchId: decoded.batchId,
    };

    // Impersonation check if admin
    const impersonateId = req.headers['x-impersonate-userid'] as string;
    if (impersonateId && req.user.role === 'ADMIN') {
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
