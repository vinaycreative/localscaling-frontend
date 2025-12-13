"use client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useLoginMutation, useFetchAuthQuery, useLogoutMutation } from "@/queries/authQueries"
import { getApiErrorMessage } from "@/utils/formatAxiosError"

export function useAuth() {
  const login = useLoginMutation()
  const logout = useLogoutMutation()
  return { login, logout, isLoginLoading: login.isPending, isLogoutLoading: logout.isPending }
}

export const useLoggedInUser = () => {
  const { data, isLoading, error } = useFetchAuthQuery()
  return { user: data, isLoading, error }
}
