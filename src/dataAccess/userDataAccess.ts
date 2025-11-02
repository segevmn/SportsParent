import { BaseDataAccess } from './baseDataAccess';
import { User, UserModel } from '../models/user';

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

  /*async deleteByIdStrict(userId: string) {
    const result = await this.deleteById(userId);
    return result;
  }*/
}
export const userDataAccess = new UserDataAccess();
