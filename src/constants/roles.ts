export const ROLES = ['user', 'coach', 'scout', 'admin'] as const;
export type Role = (typeof ROLES)[number];

export function isRole(val: unknown): val is Role {
  return typeof val === 'string' && (ROLES as readonly string[]).includes(val);
}

export const ROLE_LABELS: Record<Role, string> = {
  user: 'User',
  coach: 'Coach',
  scout: 'Scout',
  admin: 'Admin',
};

export const ROLES_ARRAY: string[] = [...ROLES];
