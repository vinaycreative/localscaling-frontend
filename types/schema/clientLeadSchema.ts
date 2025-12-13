import { z } from "zod"
import { ApiResponseSchema } from "@/types/schema/commonSchema"

export const createClientsSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  client_name: z
    .string()
    .min(1, "Client name is required")
    .max(100, "Client name must be less than 100 characters"),
  client_email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  vat_id: z.string().min(1, "VAT ID is required"),
  street_address: z.string().min(1, "Street address is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required").max(50, "State must be less than 50 characters"),
  country: z
    .string()
    .min(1, "Country is required")
    .max(50, "Country must be less than 50 characters"),
  monthly_payment: z
    .string()
    .min(1, "Monthly payment is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount (e.g., 1000 or 1000.50)")
    .transform((val) => parseFloat(val).toFixed(2)),
})

export type CreateClientsSchema = z.infer<typeof createClientsSchema>
export const CreateClientsResponseSchema = ApiResponseSchema(createClientsSchema)
export type CreateClientsResponse = z.infer<typeof CreateClientsResponseSchema>
