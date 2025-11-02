import { userDataAccess } from '../dataAccess/userDataAccess';
import { logger } from '../utils/logger';
import { NotFoundError, ValidationError } from '../utils/errors';

export const userService = {
  /*
  async getUsers(..._args: any[]): Promise<any> {
    throw new Error('NotImplemented: getUsers');
  },
  async getUserById(..._args: any[]): Promise<any> {
    throw new Error('NotImplemented: getUserById');
  },
  async updateUser(..._args: any[]): Promise<any> {
    throw new Error('NotImplemented: updateUser');
  },*/
  async deleteUser(userId: string): Promise<void> {
    const result = await userDataAccess.deleteById(userId);
    if (!result) throw NotFoundError('User not found');
    logger.info(`User ${userId} deleted`);
  },
};
