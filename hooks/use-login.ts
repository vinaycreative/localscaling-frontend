"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { login as apiLogin } from "@/lib/auth/api"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"

export function useLogin() {
  const qc = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  const router = useRouter()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiLogin(email, password),
    onSuccess: async (user) => {
      setUser(user)
      await qc.invalidateQueries()
      router.refresh()
    },
  })
}
