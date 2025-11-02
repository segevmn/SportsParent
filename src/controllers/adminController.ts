import { Request, Response, NextFunction } from 'express';

import { userService } from '../services/userService';
import { logger } from '../utils/logger';

export async function deleteUser(req: any, res: any, next: any) {
  try {
    const userId = req.params.id as string;
    await userService.deleteUser(userId);
    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (error: any) {
    logger.error('Error deleting user:', error.message);
    next(error);
  }
}
