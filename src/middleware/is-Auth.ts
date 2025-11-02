import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { logger } from '../utils/logger';
import { getEnv } from '../config/env';

const JWT_SECRET = getEnv('JWT_SECRET');

export function isAuth(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer '))
      token = authHeader.slice(7);
    else if ((req as any).cookies?.token) token = (req as any).cookies.token;

    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decodedToken = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = {
      id: decodedToken.id,
      email: decodedToken.email,
      //   username: decodedToken.username,
      role: decodedToken.role,
    };
    (req as any).userId = decodedToken.id;
    next();
  } catch (error: any) {
    logger.error('Error verifying token', error);
    return res.status(401).json({ message: 'Token verification failed' });
  }
}
