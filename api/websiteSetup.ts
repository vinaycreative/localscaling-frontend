import { api } from "@/lib/api"
import { WebsiteSetupForm } from "@/form/website-setup/schema"
import { WebsiteSetupResponseSchema } from "@/types/schema/websiteSetupSchema"

export const getWebsiteSetup = async () => {
  const res = await api.get("/client/info/website-setup")
  return WebsiteSetupResponseSchema.safeParse(res.data)
}

export const createWebsiteSetup = async (data: WebsiteSetupForm) => {
  const res = await api.post("/client/info/website-setup/create", data)
  return res.data
}
