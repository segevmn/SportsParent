import { logger } from './logger';

export type AuditAction =
  | 'admin.role.changed'
  | 'admin.verify.coach'
  | 'admin.verify.scout';

export function logAudit(
  adminId: string | undefined,
  action: AuditAction,
  targetId: string,
  details: Record<string, any> = {},
) {
  logger.info(` [AUDIT] ${action}`, { adminId, targetId, ...details });
}
