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
    queryFn: async () => fetchLoggedInUser(),
    retry: 3,
  })
}

export const useLoginMutation = (type: "internal" | "client") => {
  const router = useRouter()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password, type),
    onSuccess: (user) => {
      useAuthStore.setState({ user: user as AuthUser, userType: type })
      // Store userType in localStorage for persistence across page refreshes
      if (typeof window !== "undefined") {
        localStorage.setItem("user-type", type)
      }
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
