import { Request, Response, NextFunction } from 'express';

import { userService } from '../services/userService';
import { logger } from '../utils/logger';
import { Role, isRole } from '../data/roles';
import { logAudit } from '../utils/audit';

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.params.id as string;
    await userService.deleteUser(userId);
    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (error: any) {
    logger.error('Error deleting user:', error.message);
    next(error);
  }
}

export async function updateUserRole(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params as { id: string };
    const { role } = req.body as { role: Role };
    if (!isRole(role)) {
      return res.status(400).json({ msg: 'Invalid role provided' });
    }
    const updateUser = await userService.updateUserRole(id, role);
    if (!updateUser) res.status(404).json({ msg: 'User not found' });

    res.setHeader('X-Role-Changed', 'true');

    const adminId = (req as any).user?.id as string | undefined;
    logAudit(adminId, 'admin.role.changed', id, { newRole: role });

    res.status(200).json({
      msg: 'User role updated successfully',
      id,
      role: updateUser.role,
    });
  } catch (error: any) {
    logger.error('Error updating user role:', error.message);
    next(error);
  }
}

export async function verifyCoach(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params as { id: string };
    const verifiedCoach = await userService.verifyCoach(id);
    if (!verifiedCoach) res.status(404).json({ msg: 'User not found' });

    const adminId = (req as any).user?.id as string | undefined;
    logAudit(adminId, 'admin.verify.coach', id);

    res.status(200).json({
      msg: 'User verified as coach successfully',
      id,
      verified: { coach: verifiedCoach.verified?.coach === true },
    });
  } catch (error: any) {
    logger.error('Error verifying coach:', error.message);
    next(error);
  }
}

export async function verifyScout(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params as { id: string };
    const verifiedScout = await userService.verifyScout(id);
    if (!verifiedScout) res.status(404).json({ msg: 'User not found' });

    const adminId = (req as any).user?.id as string | undefined;
    logAudit(adminId, 'admin.verify.scout', id);

    res.status(200).json({
      msg: 'User verified as scout successfully',
      id,
      verified: { scout: verifiedScout.verified?.scout === true },
    });
  } catch (error: any) {
    logger.error('Error verifying scout:', error.message);
    next(error);
  }
}
