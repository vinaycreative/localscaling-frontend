import { api } from "@/lib/api"

export const getClientProfile = async (id: string) => {
  const response = await api.get(`/admin/clients/${id}/profile`)
  return response.data
}
