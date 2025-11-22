import { userDataAccess } from '../dataAccess/userDataAccess';
import { logger } from '../utils/logger';
import { NotFoundError, ValidationError } from '../utils/errors';
import { ROLES, Role } from '../constants/roles';

export const userService = {
  async deleteUser(userId: string): Promise<void> {
    const result = await userDataAccess.deleteById(userId);
    if (!result) throw NotFoundError('User not found');
    logger.info(`User ${userId} deleted`);
  },
  async updateUserRole(userId: string, role: Role) {
    if (!ROLES.includes(role)) {
      throw ValidationError('Invalid role provided');
    }
    const updatedUser = await userDataAccess.updateRoleById(userId, {
      role,
    } as any);
    if (!updatedUser) throw NotFoundError('User not found');
    logger.info(`User ${userId} role updated to ${role}`);
    return updatedUser;
  },
  async verifyCoach(userId: string) {
    const updatedUser = await userDataAccess.updateVerificationById(
      userId,
      'coach',
      true,
    );
    if (!updatedUser) throw NotFoundError('User not found');
    logger.info(`User ${userId} verified as coach`);
    return updatedUser;
  },
  async verifyScout(userId: string) {
    const updatedUser = await userDataAccess.updateVerificationById(
      userId,
      'scout',
      true,
    );
    if (!updatedUser) throw NotFoundError('User not found');
    logger.info(`User ${userId} verified as scout`);
    return updatedUser;
  },
};
