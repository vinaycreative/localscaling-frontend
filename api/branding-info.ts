import { BrandingInfoPayload } from "@/interfaces/onboarding/branding-content"
import { api } from "@/lib/api"
import { logError } from "@/lib/utils"

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
