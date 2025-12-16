"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { DefaultRedirectByRole, type RoleValue } from "@/constants/auth"
import { useAuthStore } from "@/store/auth"

export function useRequireRole(roles: RoleValue | RoleValue[]) {
  const router = useRouter()
  const pathname = usePathname()
  const { hasRole, user } = useAuthStore()

  useEffect(() => {
    if (!user) return // middleware handles unauthenticated redirect
    const allowed = hasRole(roles as any)
    if (!allowed) {
      const target = DefaultRedirectByRole[user.role] ?? "/"
      if (pathname !== target) router.replace(target)
    }
  }, [user, roles, router, pathname, hasRole])
}
