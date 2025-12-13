export const Role = {
  client: "client",
  support_head_admin: "support_head_admin",
  support_admin: "support_admin",
  admin: "admin",
} as const

export type RoleKey = keyof typeof Role
export type RoleValue = (typeof Role)[RoleKey]

// App-visible URL prefixes per role (route groups like (private) are not part of URLs)
export const RoleRoutes: Record<RoleValue, readonly string[]> = {
  [Role.client]: ["/dashboard", "/tasks", "/support"],
  [Role.support_head_admin]: ["/dashboard", "/tickets", "/support"],
  [Role.support_admin]: ["/dashboard", "/tickets", "/support"],
  [Role.admin]: ["/dashboard", "/projects", "/clients", "/tools", "/finance", "/support"],
} as const

export const DefaultRedirectByRole: Record<RoleValue, string> = {
  [Role.client]: "/dashboard",
  [Role.support_head_admin]: "/tickets",
  [Role.support_admin]: "/tickets",
  [Role.admin]: "/dashboard",
} as const

export function canAccessPath(role: RoleValue, pathname: string): boolean {
  const allowedPrefixes = RoleRoutes[role] || []
  return allowedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"))
}
