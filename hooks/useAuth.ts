"use client"
import { useLoginMutation, useFetchAuthQuery, useLogoutMutation } from "@/queries/authQueries"

export function useAuth(type: "internal" | "client") {
  const login = useLoginMutation(type)
  const logout = useLogoutMutation()
  return { login, logout, isLoginLoading: login.isPending, isLogoutLoading: logout.isPending }
}

export const useLoggedInUser = () => {
  const { data, isLoading, error } = useFetchAuthQuery()
  return { user: data, isLoading, error }
}
