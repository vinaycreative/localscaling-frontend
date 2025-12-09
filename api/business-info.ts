import { BusinessFormData } from "@/interfaces/onboarding/business-information"
import { api } from "@/lib/api"
import { logError } from "@/lib/utils"

export async function getBusinessInfo() {
  try {
    const res = await api.get("/onboarding/business-info")
    return res.data
  } catch (error) {
    console.error("Error fetching business info", error)
    return null
  }
}

export async function createBusinessInfo(data: BusinessFormData) {
  try {
    console.log("data is ", data)
    const res = await api.post("/onboarding/business-info", data)
    return res.data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save business information")
  }
}
