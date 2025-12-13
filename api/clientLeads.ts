import { api } from "@/lib/api"
import {
  CreateClientsSchema,
  CreateClientsResponseSchema,
  GetClientsResponseSchema,
} from "@/form/client-lead/schema"

export const createClientLead = async (data: CreateClientsSchema) => {
  const response = await api.post("/admin/clients", data)
  return CreateClientsResponseSchema.safeParse(response.data)
}

export const getClientLeads = async () => {
  const response = await api.get("/admin/clients")
  return GetClientsResponseSchema.safeParse(response.data)
}
