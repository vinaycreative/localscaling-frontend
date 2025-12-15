import { api } from "@/lib/api"
import {
  CreateClientsResponseSchema,
  GetClientsResponseSchema,
} from "@/types/schema/clientLeadSchema"

export const createClientLead = async (data: any) => {
  const response = await api.post("/admin/clients", data)
  return CreateClientsResponseSchema.safeParse(response.data)
}

export const getClientLeads = async () => {
  const response = await api.get("/admin/clients")
  console.log("Data: ", response.data.data)
  return GetClientsResponseSchema.safeParse(response.data)
}

// Test endpoint

export const successPayment = async (id: string) => {
  const response = await api.post(`/admin/clients/success-payment/${id}`)
  return response.data.data
}
