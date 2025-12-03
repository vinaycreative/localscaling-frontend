import { ApiUser, MeResponseSchema } from "@/lib/auth/schema";
import axios from "axios";
import { logError } from "../utils";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

export async function fetchMe(): Promise<ApiUser | null> {
  try {
    const res = await api.get("/auth/me");
    const parsed = MeResponseSchema.parse(res.data);
    return parsed.user;
  } catch (error) {
    logError(error);
    throw new Error("Failed to fetch session");
  }
}

export async function login(email: string, password: string): Promise<ApiUser> {
  try {
    const res = await api.post("/auth/login", { email, password });
    const parsed = MeResponseSchema.parse(res.data);
    return parsed.user;
  } catch (error) {
    logError(error);
    throw new Error("Login failed");
  }
}

export async function devLogin(): Promise<ApiUser> {
  try {
    const res = await api.post("/auth/dev-login");
    console.log("res is ", res);
    const parsed = MeResponseSchema.parse(res.data.data);
    console.log("parsed is ", parsed);
    return parsed.user;
  } catch (error) {
    logError(error);
    throw new Error("Dev Login failed");
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    logError(error);
    throw new Error("Logout failed");
  }
}

export async function signup(
  email: string,
  password: string
): Promise<{ userEmail: string }> {
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  try {
    await api.post("/auth/signup", {
      email,
      password,
    });

    return { userEmail: email };
  } catch (error) {
    logError(error);
    throw new Error("Signup failed. Please try again.");
  }
}
