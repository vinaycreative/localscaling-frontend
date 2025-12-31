import { z } from "zod"
import { ApiResponseSchema } from "@/types/schema/commonSchema"

export const createClientsSchema = z.object({
  id: z.string(),
  company_name: z.string(),
  name: z.string(),
  email: z.string(),
  vat_id: z.string(),
  address: z.string(),
  postal_code: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  monthly_payment_excluding_taxes: z.string(),
  payment_status: z.string(),
  payment_link: z.string().nullable(),
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  status: z.string(),
})

export const getClientsSchema = z.object({
  id: z.string(),
  company_name: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  vat_id: z.string().optional(),
  address: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  monthly_payment_excluding_taxes: z.string().optional(),
  payment_status: z.string().optional(),
  payment_link: z.string().optional().nullable(),
  user_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  status: z.string().optional(),
})

export const GetClientsResponseSchema = ApiResponseSchema(z.array(getClientsSchema))
export type ClientLeads = z.infer<typeof GetClientsResponseSchema>
export type CreateClientsSchema = z.infer<typeof createClientsSchema>
export const CreateClientsResponseSchema = ApiResponseSchema(createClientsSchema)
export type CreateClientsResponse = z.infer<typeof CreateClientsResponseSchema>
