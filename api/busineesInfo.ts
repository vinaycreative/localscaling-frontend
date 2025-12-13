import { api } from "@/lib/api"
import { BusinessInformationResponseSchema } from "@/form/business-information/schemas"

export const getBusinessInfo = async () => {
  const res = await api.get("/onboarding/business-info")
  return BusinessInformationResponseSchema.safeParse(res.data)
}

export const createBusinessInfo = async (data: any) => {
  const res = await api.post("/onboarding/business-info", data)
  return BusinessInformationResponseSchema.safeParse(res.data)
}
