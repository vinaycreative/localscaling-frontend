"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DefaultRedirectByRole, type RoleValue } from "@/constants/auth"

export function useRequireRole(roles: RoleValue | RoleValue[]) {
  const router = useRouter()
  const pathname = usePathname()
  const { hasRole, user } = useAuth()

  useEffect(() => {
    if (!user) return // middleware handles unauthenticated redirect
    const allowed = hasRole(roles as any)
    if (!allowed) {
      const target = DefaultRedirectByRole[user.role] ?? "/"
      if (pathname !== target) router.replace(target)
    }
  }, [user, roles, router, pathname, hasRole])
}
