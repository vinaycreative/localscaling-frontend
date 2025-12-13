import { create } from "zustand"
import { AuthUser, AuthUserSchema } from "@/types/schema/auth"
import { canAccessPath, Role, RoleValue } from "@/constants/auth"
import { useStore } from "zustand"

type AuthState = {
  user: AuthUser | null
  setAuth: (user: AuthUser) => void
  clearAuth: () => void
  hasRole: (roles: RoleValue) => boolean
  canAccess: (pathname: string) => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  setAuth: (user) => set({ user }),
  clearAuth: () => set({ user: null }),
  hasRole: (roles) => {
    const current = get().user?.role as RoleValue
    if (!current) return false
    const arr = Array.isArray(roles) ? roles : [roles]
    return arr.includes(current)
  },
  canAccess: (pathname) => {
    const role = (get().user?.role as RoleValue) ?? Role.client
    return canAccessPath(role, pathname)
  },
}))
