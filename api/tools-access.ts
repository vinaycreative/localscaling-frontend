import { ToolsAccessForm } from "@/interfaces/onboarding/tools-access"
import { api } from "@/lib/api"
import { logError } from "@/lib/utils"

export async function getToolsAccess() {
  try {
    const res = await api.get("/onboarding/tools-access")
    return res.data
  } catch (error) {
    console.error("Error fetching tools-access", error)
    return null
  }
}

export async function createToolsAccess(data: ToolsAccessForm) {
  try {
    console.log("Saving tools-access Data:", data)
    const res = await api.post("/onboarding/tools-access", { ...data })
    return res.data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save tools-access information")
  }
}
