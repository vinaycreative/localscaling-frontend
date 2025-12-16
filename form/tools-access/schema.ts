import z from "zod"

export const toolsAccessSchema = z.object({
  google_ads_access_granted: z.boolean(),
  gtm_access_granted: z.boolean(),
  ga4_access_granted: z.boolean(),
  google_search_console_access_granted: z.boolean(),
})
