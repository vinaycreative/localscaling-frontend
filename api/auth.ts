import { api } from "@/lib/api"
import { ApiUser, MeResponseSchema } from "@/lib/auth/schema"
import { logError } from "@/lib/utils"
import axios from "axios"

export async function fetchMe(): Promise<ApiUser | null> {
  try {
    const res = await api.get("/auth/me")

    if (res.status === 204 || !res.data || Object.keys(res.data).length === 0) {
      return null
    }

    const parsed = MeResponseSchema.parse(res.data)
    return parsed.user
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logError(error)
      return null
    }
    return null
  }
}

export async function login(email: string, password: string): Promise<ApiUser> {
  try {
    const res = await api.post("/auth/login", { email, password })
    const parsed = MeResponseSchema.parse(res.data)
    return parsed.user
  } catch (error) {
    logError(error)
    throw new Error("Login failed")
  }
}

export async function devLogin(): Promise<ApiUser> {
  try {
    const res = await api.post("/auth/dev-login")
    console.log("res is ", res)
    const parsed = MeResponseSchema.parse(res.data.data)
    console.log("parsed is ", parsed)
    return parsed.user
  } catch (error) {
    logError(error)
    throw new Error("Dev Login failed")
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout")
  } catch (error) {
    logError(error)
    throw new Error("Logout failed")
  }
}

export async function signup(email: string, password: string): Promise<{ userEmail: string }> {
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.")
  }

  try {
    await api.post("/auth/signup", {
      email,
      password,
    })

    return { userEmail: email }
  } catch (error) {
    logError(error)
    throw new Error("Signup failed. Please try again.")
  }
}