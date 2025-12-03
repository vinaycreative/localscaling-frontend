import { ApiUser, MeResponseSchema } from "@/lib/auth/schema";
import axios from "axios";
import { logError } from "./utils";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface BusinessInfoPayload {
  company_name: string;
  company_start_year: number;
  street_address: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  vat_id?: string;
  contact_name: string;
  contact_email: string;
  contact_number: string;
  whatsapp_number?: string;
  current_website?: string;
  socials?: {
    facebook_link?: string;
    instagram_link?: string;
    twitter_link?: string;
    google_business_link?: string;
    linkedin_link?: string;
    youtube_link?: string;
  };
}

export async function fetchMe(): Promise<ApiUser | null> {
  try {
    const res = await api.get("/auth/me");

    if (res.status === 204 || !res.data || Object.keys(res.data).length === 0) {
      return null;
    }

    const parsed = MeResponseSchema.parse(res.data);
    return parsed.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logError(error);
      return null;
    }
    return null;
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

export async function getBusinessInfo() {
  try {
    const res = await api.get("/onboarding/business-info");
    return res.data;
  } catch (error) {
    console.error("Error fetching business info", error);
    return null;
  }
}

export async function saveBusinessInfo(data: BusinessInfoPayload) {
  try {
    console.log("data is ", data);
    const res = await api.post("/onboarding/business-info", data);
    return res.data;
  } catch (error) {
    logError(error);
    throw new Error("Failed to save business information");
  }
}
