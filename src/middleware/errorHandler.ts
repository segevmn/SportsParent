import { Request, Response, NextFunction } from 'express';

import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) return next(err);
  logger.error(
    `${req.method} ${req.originalUrl} — ${err.message ?? 'Unknown Error'}`,
  );
  const stat =
    (err as any)?.status ?? (err?.name === 'ValidationError' ? 400 : 500);
  res.status(stat).json({
    status: 'error',
    message: err?.message ?? 'Internal Server Error',
  });
}
