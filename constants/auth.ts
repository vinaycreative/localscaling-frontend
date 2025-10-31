export const Role = {
  CLIENT: 'CLIENT',
  SUPPORT_HEAD_ADMIN: 'SUPPORT_HEAD_ADMIN',
  SUPPORT_ADMIN: 'SUPPORT_ADMIN',
  ADMIN: 'ADMIN',
} as const;

export type RoleKey = keyof typeof Role;
export type RoleValue = (typeof Role)[RoleKey];

// App-visible URL prefixes per role (route groups like (private) are not part of URLs)
export const RoleRoutes: Record<RoleValue, readonly string[]> = {
  [Role.CLIENT]: ['/tasks'],
  [Role.SUPPORT_HEAD_ADMIN]: ['/support', '/dashboard'],
  [Role.SUPPORT_ADMIN]: ['/support', '/dashboard'],
  [Role.ADMIN]: ['/clients', '/projects', '/finance', '/tools', '/dashboard', '/support', '/tasks'],
} as const;

export const DefaultRedirectByRole: Record<RoleValue, string> = {
  [Role.CLIENT]: '/tasks',
  [Role.SUPPORT_HEAD_ADMIN]: '/support',
  [Role.SUPPORT_ADMIN]: '/support',
  [Role.ADMIN]: '/dashboard',
} as const;

export function canAccessPath(role: RoleValue, pathname: string): boolean {
  const allowedPrefixes = RoleRoutes[role] || [];
  return allowedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));
}


