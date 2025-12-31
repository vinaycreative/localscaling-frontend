import { cleanFilters } from "@/components/data-table/utils"
import { api } from "@/lib/api"
import { GetClientsFilters } from "@/types/clients"
import {
  CreateClientsResponseSchema,
  GetClientsResponseSchema,
} from "@/types/schema/clientLeadSchema"

export const createClientLead = async (data: unknown) => {
  const response = await api.post("/admin/clients", data)
  return CreateClientsResponseSchema.safeParse(response.data)
}

export const getClientLeads = async (type: "internal" | "client", filters?: GetClientsFilters) => {
  const response = await api.get("/admin/clients", {
    params: cleanFilters(filters as GetClientsFilters),
  })
  return response.data
  // return ClientsPaginationSchema.safeParse(response.data)
}

// Test endpoint

export const successPayment = async (id: string) => {
  const response = await api.post(`/admin/clients/success-payment/${id}`)
  return response.data.data
}
