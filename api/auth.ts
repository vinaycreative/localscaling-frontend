import { api } from "@/lib/api"
import { AuthUser, LoginResponseSchema } from "@/lib/auth/schema"

export const login = async (
  email: string,
  password: string,
  type: "internal" | "client"
): Promise<AuthUser> => {
  let user: AuthUser
  if (type === "internal") {
    const res = await api.post("/admin/auth/login", { email, password })
    console.log("res is ", res.data)
    user = LoginResponseSchema.parse(res.data).data
  } else {
    const res = await api.post("/client/auth/login", { email, password })
    user = LoginResponseSchema.parse(res.data).data
  }

  // Store user-type in localStorage after successful login
  if (typeof window !== "undefined") {
    localStorage.setItem("user-type", type)
  }

  return user
}

export const fetchLoggedInUser = async (): Promise<AuthUser> => {
  if (typeof window === "undefined") {
    throw new Error("fetchLoggedInUser can only be called on the client side")
  }

  const userType = localStorage.getItem("user-type") as "internal" | "client" | null

  if (userType === "internal") {
    const res = await api.get("/admin/auth/me")
    return LoginResponseSchema.parse(res.data).data
  } else {
    const res = await api.get("/client/auth/me")
    return LoginResponseSchema.parse(res.data).data
  }
}

export async function logout(): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("logout can only be called on the client side")
  }

  const userType = localStorage.getItem("user-type") as "internal" | "client" | null
  if (userType === "internal") {
    await api.post("/admin/auth/logout")
  } else {
    await api.post("/client/auth/logout")
  }
  // Clear user-type from localStorage after successful logout
  localStorage.removeItem("user-type")
}

export async function signup(email: string, password: string): Promise<{ userEmail: string }> {
  await api.post("/auth/signup", {
    email,
    password,
  })

  return { userEmail: email }
}
