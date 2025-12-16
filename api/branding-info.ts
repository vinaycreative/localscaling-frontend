import { BrandingInfoPayload } from "@/form/branding-content/types"
import { api } from "@/lib/api"
import { logError } from "@/lib/utils"

export async function getBrandingInfo(): Promise<BrandingInfoPayload | any> {
  try {
    const res = await api.get("/client/info/branding-info")
    return res.data
  } catch (error) {
    console.error("Error fetching branding info", error)
    return error
  }
}

export async function saveBrandingInfo(data: BrandingInfoPayload) {
  try {
    console.log("Saving Branding Data:", data)
    const res = await api.post("/client/info/branding-info", data)
    return res.data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save branding information")
  }
}
