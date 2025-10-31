import { create } from "zustand"
import { Role, type RoleValue, canAccessPath } from "@/constants/auth"

export type AuthUser = {
  id: string
  name: string
  email: string
  role: RoleValue
} | null

type AuthState = {
  user: AuthUser
  isAuthenticated: boolean
  setUser: (user: NonNullable<AuthUser>) => void
  clear: () => void
  hasRole: (roles: RoleValue | RoleValue[]) => boolean
  canAccess: (pathname: string) => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clear: () => set({ user: null, isAuthenticated: false }),
  hasRole: (roles) => {
    const current = get().user?.role
    if (!current) return false
    const arr = Array.isArray(roles) ? roles : [roles]
    return arr.includes(current)
  },
  canAccess: (pathname) => {
    const role = get().user?.role ?? Role.CLIENT
    return canAccessPath(role, pathname)
  },
}))
