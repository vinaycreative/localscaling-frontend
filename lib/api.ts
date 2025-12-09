import { IntroductoryVideoOption, TeamMember } from "@/interfaces/onboarding/branding-content"
import { BusinessFormData } from "@/interfaces/onboarding/business-information"
import { LocationsBudgetForm } from "@/interfaces/onboarding/locations-budget"
import { ApiUser, MeResponseSchema } from "@/lib/auth/schema"
import axios from "axios"
import { logError } from "./utils"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export async function getBusinessInfo() {
  try {
    const res = await api.get("/onboarding/business-info")
    return res.data
  } catch (error) {
    console.error("Error fetching business info", error)
    return null
  }
}

export async function saveBusinessInfo(data: BusinessFormData) {
  try {
    console.log("data is ", data)
    const res = await api.post("/onboarding/business-info", data)
    return res.data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save business information")
  }
}

export interface BrandingInfoPayload {
  fontLink: string
  primaryBrandColor: string
  secondaryBrandColor: string
  logoUrl: string
  teamPhotoUrls: string[]
  teamMembers: TeamMember[]
  videoCreationOption: IntroductoryVideoOption
  ceoVideoUrl: string
  videoTestimonialUrl: string
}

export async function getBrandingInfo() {
  try {
    const res = await api.get("/onboarding/branding")
    return res.data
  } catch (error) {
    console.error("Error fetching branding info", error)
    return null
  }
}

export async function saveBrandingInfo(data: BrandingInfoPayload) {
  try {
    console.log("Saving Branding Data:", data)
    const res = await api.post("/onboarding/branding", data)
    return res.data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save branding information")
  }
}

export interface WebsiteSetupPayload {
  accessGranted: boolean
  domainProvider: string
  businessClientsWorked: string[]
  legalLinks: string[]
  legalFiles: string[]
  seoLocations: string[]
}

export async function getWebsiteSetup() {
  try {
    const res = await api.get("/onboarding/website-setup")
    return res.data
  } catch (error) {
    console.error("Error fetching website setup info", error)
    return null
  }
}

export async function saveWebsiteSetup(data: WebsiteSetupPayload) {
  try {
    console.log("Saving Website Setup Data:", data)
    const res = await api.post("/onboarding/website-setup", data)
    return res.data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save website setup information")
  }
}

export async function getAdsBudget() {
  try {
    const res = await api.get("/onboarding/ads-budget")
    return res.data
  } catch (error) {
    console.error("Error fetching ads budget info", error)
    return null
  }
}

export async function saveAdsBudget(data: LocationsBudgetForm) {
  try {
    console.log("Saving Ads Budget Data:", data)
    const res = await api.post("/onboarding/ads-budget", data)
    return res.data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save ads budget information")
  }
}
