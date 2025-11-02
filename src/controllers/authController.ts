import { Request, Response, NextFunction } from 'express';

import { authService } from '../services/authService';
import { getEnv } from '../config/env';
import { logger } from '../utils/logger';

export async function getLogin(req: any, res: any, next: any) {
  res.status(200).json({});
}

export async function getSignup(req: any, res: any, next: any) {
  res.status(200).json({});
}

export async function postLogin(req: any, res: any, next: any) {
  const { email, password } = req.body;
  try {
    const user = await authService.login(email, password);
    const NODE_ENV = getEnv('NODE_ENV', 'development');
    res
      .cookie('token', user.token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json({ message: 'Login successful' });
  } catch (error) {
    logger.warn(`Login failed for email: ${email}`, error);
    next(error);
  }
}

export async function postSignup(req: any, res: any, next: any) {
  const { email, password, username } = req.body;
  try {
    const user = await authService.signup(email, password, username);
    const NODE_ENV = getEnv('NODE_ENV', 'development');
    res
      .cookie('token', user.token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(201)
      .json({ message: 'Signup successful' });
  } catch (error) {
    logger.warn(`Signup failed for email: ${email}`, error);
    next(error);
  }
}

export async function postLogout(req: any, res: any, next: any) {
  const isProd = process.env.NODE_ENV === 'production';
  const base = {
    path: '/',
    sameSite: 'lax' as const,
    domain: process.env.COOKIE_DOMAIN || undefined,
    secure: isProd,
  };

  // אם ה-token נשמר כ-HttpOnly (מומלץ)
  res.clearCookie('token', { ...base, httpOnly: true });

  // תאימות לאחור: אם ה-token נשמר ללא HttpOnly בעבר
  res.clearCookie('token', { ...base, httpOnly: false });

  res.status(204).end();
}

export async function postRefresh(req: any, res: any, next: any) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: 'Refresh token is required' });
    const { token } = await authService.refreshToken(refreshToken);
    return res.status(200).json({ token });
  } catch (error) {
    logger.warn(`Refresh token failed`, error);
    next(error);
  }
}
