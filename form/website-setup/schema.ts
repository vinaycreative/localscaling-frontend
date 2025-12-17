import z from "zod"
export const WebsiteSetupSchema = z.object({
  access_granted: z.boolean(),
  domain_provider: z.string().min(1, { message: "Domain provider is required" }),
  business_clients_worked: z.array(z.string()).default([]),
  legal_links: z.array(z.string().url({ message: "Invalid URL in legal links" })).default([]),
  legal_files: z.array(z.any()).default([]),
  seo_locations: z.array(z.string()).default([]),
})

export type WebsiteSetupForm = z.infer<typeof WebsiteSetupSchema>
