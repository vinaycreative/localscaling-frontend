import { ClientsFormData } from "@/interfaces/onboarding/clients"
import { api } from "@/lib/api"
import { logError } from "@/lib/utils"

export async function getNewClients() {
  try {
    const res = await api.get("/onboarding/clients")
    return res.data
  } catch (error) {
    console.error("Error fetching branding info", error)
    return null
  }
}

export async function createNewClients(data: ClientsFormData) {
  try {
    console.log("Saving Branding Data:", data)
    const res = await api.post("/onboarding/clients/create", { ...data })
    return res.data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save branding information")
  }
}
