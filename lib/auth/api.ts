import axios from "axios"
import { ApiUser, MeResponseSchema } from "@/lib/auth/schema"

const api = axios.create({ withCredentials: true })

export async function fetchMe(): Promise<ApiUser | null> {
  try {
    const res = await api.get("/api/auth/me")
    const parsed = MeResponseSchema.parse(res.data)
    return parsed.user
  } catch (err: any) {
    if (err?.response?.status === 401) return null
    throw new Error(err?.response?.data?.error || "Failed to fetch session")
  }
}

export async function login(email: string, password: string): Promise<ApiUser> {
  try {
    const res = await api.post("/api/auth/login", { email, password })
    const parsed = MeResponseSchema.parse(res.data)
    return parsed.user
  } catch (err: any) {
    throw new Error(err?.response?.data?.error || "Login failed")
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post("/api/auth/logout")
  } catch (err: any) {
    throw new Error(err?.response?.data?.error || "Logout failed")
  }
}
