import { useMutation, useQuery } from "@tanstack/react-query"
import { AuthUser, LoginResponseSchema } from "@/lib/auth/schema"
import { login, fetchLoggedInUser, logout } from "@/api/auth"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/utils/formatAxiosError"
import { useAuthStore } from "@/store/authStore"
import { DefaultRedirectByRole, type Role, type RoleValue } from "@/constants/auth"
import { useRouter } from "next/navigation"

export const useFetchAuthQuery = () => {
  return useQuery<AuthUser>({
    queryKey: ["auth"],
    queryFn: async () => {
      const user = await fetchLoggedInUser()
      if (user) {
        useAuthStore.setState({ user: user as AuthUser })
      }
      return user
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: false,
  })
}

export const useLoginMutation = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (user) => {
      useAuthStore.setState({ user: user as AuthUser })
      toast.success(`Welcome ${user?.first_name} ${user?.last_name}`)
      router.replace(DefaultRedirectByRole[user.role as RoleValue] ?? "/")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

export const useLogoutMutation = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      useAuthStore.setState({ user: null })
      router.replace("/login")
      toast.success("Logged out successfully")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}
