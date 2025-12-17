import z from "zod"
import { ApiResponseSchema } from "./commonSchema"
export const WebsiteSetupSchema = z.object({
  access_granted: z.boolean(),
  domain_provider: z.string().min(1, { message: "Domain provider is required" }),
  business_clients_worked: z.array(z.string()).default([]),
  legal_links: z.array(z.string().url({ message: "Invalid URL in legal links" })).default([]),
  legal_files: z.array(z.any()).default([]),
  seo_locations: z.array(z.string()).default([]),
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const WebsiteSetupResponseSchema = ApiResponseSchema(WebsiteSetupSchema)
export type WebsiteSetupResponse = z.infer<typeof WebsiteSetupResponseSchema>
