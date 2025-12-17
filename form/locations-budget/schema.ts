import z from "zod"

export const LocationsBudgetSchema = z.object({
  budget: z.string().min(1, "Budget is required"),
  currency: z.string().min(1, "Currency is required"),
  seo_locations: z.array(z.string()),
  services_provided: z.array(z.string()),
})
