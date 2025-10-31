"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { login as apiLogin } from "@/lib/auth/api"
import { useAuthStore } from "@/store/auth"

export function useLogin() {
  const qc = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiLogin(email, password),
    onSuccess: async (user) => {
      setUser(user)
      await qc.invalidateQueries()
    },
  })
}
