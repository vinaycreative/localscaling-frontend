import { api } from "@/lib/api"
import { AuthUser, LoginResponseSchema } from "@/lib/auth/schema"
import { logError } from "@/lib/utils"
import axios from "axios"

// export async function fetchMe(): Promise<ApiUser | null> {
//   try {
//     const res = await api.get("/auth/me")

//     if (res.status === 204 || !res.data || Object.keys(res.data).length === 0) {
//       return null
//     }

//     const parsed = MeResponseSchema.parse(res.data)
//     return parsed.user
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       logError(error)
//       return null
//     }
//     return null
//   }
// }

export const login = async (email: string, password: string): Promise<AuthUser> => {
  const res = await api.post("/auth/login", { email, password })
  return LoginResponseSchema.parse(res.data).data
}

export const fetchLoggedInUser = async (): Promise<AuthUser> => {
  const res = await api.get("/auth/me")
  console.log("res is ", res.data)
  return LoginResponseSchema.parse(res.data).data
}

// export async function devLogin(): Promise<AuthUser> {
//   try {
//     const res = await api.post("/auth/dev-login")
//     console.log("res is ", res)
//     const parsed = LoginResponseSchema.parse(res.data.data)
//     console.log("parsed is ", parsed)
//     return parsed.user
//   } catch (error) {
//     logError(error)
//     throw new Error("Dev Login failed")
//   }
// }

export async function logout(): Promise<void> {
  await api.post("/auth/logout")
}

export async function signup(email: string, password: string): Promise<{ userEmail: string }> {
  await api.post("/auth/signup", {
    email,
    password,
  })

  return { userEmail: email }
}
