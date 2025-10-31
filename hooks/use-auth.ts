"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchMe } from "@/lib/auth/api"
import { useAuthStore } from "@/store/auth"
import { useEffect } from "react"

export const authQueryKey = ["auth", "me"] as const

export function useAuth() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  const clear = useAuthStore((s) => s.clear)
  const storeUser = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const hasRole = useAuthStore((s) => s.hasRole)
  const canAccess = useAuthStore((s) => s.canAccess)

  const query = useQuery({
    queryKey: authQueryKey,
    queryFn: fetchMe,
    staleTime: 60_000,
    retry: false,
  })

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUser(query.data)
    } else if (query.isError || (query.isSuccess && !query.data)) {
      clear()
      // also clear any cached queries that might depend on auth
      queryClient.invalidateQueries()
    }
  }, [query.status, query.data, setUser, clear, queryClient])

  return {
    user: storeUser,
    isAuthenticated,
    hasRole,
    canAccess,
    status: query.status,
    isLoading: query.isLoading,
    refetch: query.refetch,
  } as const
}
