import bcrypt from 'bcryptjs';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';

import { getEnv } from '../config/env';
import { userDataAccess } from '../dataAccess/userDataAccess';
import { createError, NotFoundError, ValidationError } from '../utils/errors';

const JWT_SECRET: Secret = getEnv('JWT_SECRET');
const JWT_REFRESH_SECRET: Secret = getEnv('JWT_REFRESH_SECRET');
const UnauthorizedError = createError('UnauthorizedError', 401);

const signOpts: SignOptions = {
  expiresIn: (getEnv('JWT_EXPIRES_IN') || '15m') as SignOptions['expiresIn'],
};

function signAccess(user: any): string {
  return jwt.sign(
    {
      id: (user as any)._id.toString(),
      email: user.email,
      role: (user as any).role, // single role
    },
    JWT_SECRET,
    signOpts,
  );
}

function signRefresh(userId: string): string {
  return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export const authService = {
  async signup(
    email: string,
    password: string,
    username: string,
    fullName?: string,
  ): Promise<any> {
    const existingUser = await userDataAccess.findByEmail(email);
    if (existingUser) throw ValidationError('Email already in use');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userDataAccess.create({
      email,
      password: hashedPassword,
      username,
      ...(fullName ? { fullName } : {}),
    });
    const token = signAccess(newUser as any);
    const refreshToken = signRefresh((newUser as any)._id.toString());
    return { user: newUser, token, refreshToken };
  },
  async login(email: string, password: string) {
    const user = await userDataAccess.findByEmail(email);
    if (!user) throw NotFoundError('User not found');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw UnauthorizedError('Invalid credentials');
    const token = signAccess(user as any);
    const refreshToken = signRefresh((user as any)._id.toString());
    return { user, token, refreshToken };
  },
  async refreshToken(token: string): Promise<any> {
    try {
      const decoded: any = jwt.verify(token, JWT_REFRESH_SECRET);
      const user = await userDataAccess.findById(decoded.id);
      if (!user) throw UnauthorizedError('User not found');
      const newToken = signAccess(user as any);
      return { token: newToken };
    } catch (err) {
      throw UnauthorizedError('Invalid refresh token');
    }
  },
  async logout(..._args: any[]): Promise<any> {
    return { message: 'Logged out successfully' };
  },
};
