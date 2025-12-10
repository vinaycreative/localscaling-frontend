import { api } from "@/lib/api"
import { logError } from "@/lib/utils"

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

export async function createWebsiteSetup(data: WebsiteSetupPayload) {
  try {
    console.log("Saving Website Setup Data:", data)
    const res = await api.post("/onboarding/website-setup", { ...data })
    return res.data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save website setup information")
  }
}
