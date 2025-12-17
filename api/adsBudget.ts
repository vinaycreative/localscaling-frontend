import { LocationsBudgetForm } from "@/interfaces/onboarding/locations-budget"
import { api } from "@/lib/api"
import { logError } from "@/lib/utils"

export async function getLocationAndBudget() {
  const res = await api.get("/client/info/ads-budget-location")
  return res.data
}

export async function createLocationAndBudget(data: LocationsBudgetForm) {
  const res = await api.post("/client/info/ads-budget-location/create", data)
  return res.data
}
