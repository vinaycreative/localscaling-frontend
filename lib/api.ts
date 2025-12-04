import {
  IntroductoryVideoOption,
  TeamMember,
} from "@/interfaces/onboarding/branding-content";
import { BusinessFormData } from "@/interfaces/onboarding/business-information";
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

export async function saveBusinessInfo(data: BusinessFormData) {
  try {
    console.log("data is ", data);
    const res = await api.post("/onboarding/business-info", data);
    return res.data;
  } catch (error) {
    logError(error);
    throw new Error("Failed to save business information");
  }
}

export interface BrandingInfoPayload {
  fontLink: string;
  primaryBrandColor: string;
  secondaryBrandColor: string;
  logoUrl: string;
  teamPhotoUrls: string[];
  teamMembers: TeamMember[];
  videoCreationOption: IntroductoryVideoOption;
  ceoVideoUrl: string;
  videoTestimonialUrl: string;
}

export async function getBrandingInfo() {
  try {
    const res = await api.get("/onboarding/branding");
    return res.data;
  } catch (error) {
    console.error("Error fetching branding info", error);
    return null;
  }
}

export async function saveBrandingInfo(data: BrandingInfoPayload) {
  try {
    console.log("Saving Branding Data:", data);
    const res = await api.post("/onboarding/branding", data);
    return res.data;
  } catch (error) {
    logError(error);
    throw new Error("Failed to save branding information");
  }
}

export interface WebsiteSetupPayload {
  accessGranted: boolean;
  domainProvider: string;
  businessClientsWorked: string[];
  legalLinks: string[];
  legalFiles: string[];
  seoLocations: string[];
}

export async function getWebsiteSetup() {
  try {
    const res = await api.get("/onboarding/website-setup");
    return res.data;
  } catch (error) {
    console.error("Error fetching website setup info", error);
    return null;
  }
}

export async function saveWebsiteSetup(data: WebsiteSetupPayload) {
  try {
    console.log("Saving Website Setup Data:", data);
    const res = await api.post("/onboarding/website-setup", data);
    return res.data;
  } catch (error) {
    logError(error);
    throw new Error("Failed to save website setup information");
  }
}
