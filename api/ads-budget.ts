import { LocationsBudgetForm } from "@/interfaces/onboarding/locations-budget"
import { api } from "@/lib/api"
import { logError } from "@/lib/utils"

export async function getAdsBudget() {
  try {
    const res = await api.get("/onboarding/ads-budget")
    return res.data
  } catch (error) {
    console.error("Error fetching ads budget info", error)
    return null
  }
}

export async function createAdsBudget(data: LocationsBudgetForm) {
  try {
    console.log("Saving Ads Budget Data:", data)
    const res = await api.post("/onboarding/ads-budget", data)
    return res.data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save ads budget information")
  }
}
