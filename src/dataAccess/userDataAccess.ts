import { BaseDataAccess } from './baseDataAccess';
import { User, UserModel } from '../models/user';
import { Role } from '../constants/roles';

import { UpdateQuery } from 'mongoose';

export class UserDataAccess extends BaseDataAccess<User> {
  constructor() {
    super(UserModel);
  }
  findByEmail(email: string) {
    return this.findOne({ email } as any);
  }
  findByUsername(username: string) {
    return this.findOne({ username } as any);
  }

  updateRoleById(userId: string, role: Role) {
    return UserModel.findByIdAndUpdate(
      userId,
      { $set: { role } } as UpdateQuery<User>,
      { new: true, runValidators: true, context: 'query' },
    ).lean();
  }
  updateVerificationById(
    userId: string,
    field: 'coach' | 'scout',
    value: boolean,
  ) {
    const updateField = `verified.${field}`;
    return UserModel.findByIdAndUpdate(
      userId,
      { $set: { [updateField]: value } } as UpdateQuery<User>,
      { new: true, runValidators: true, context: 'query' },
    ).lean();
  }
}
export const userDataAccess = new UserDataAccess();
