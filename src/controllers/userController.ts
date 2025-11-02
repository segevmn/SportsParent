import { Request, Response, NextFunction } from 'express';

import { userService } from '../services/userService';
import { logger } from '../utils/logger';

type AuthRequest = Request & { userId?: string };

export async function deleteSelf(req: any, res: any, next: any) {
  try {
    const userId = (req as AuthRequest).userId!;
    await userService.deleteUser(userId);
    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (error: any) {
    logger.error('Error deleting user:', error.message);
    next(error);
  }
}
