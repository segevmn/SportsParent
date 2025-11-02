import { Request, Response, NextFunction } from 'express';
export default function requireRole(expectedRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as { role?: string } | undefined;
    if (!user || user.role !== expectedRole) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}
