import {
  useCreateClientLeadMutation,
  useGetClientLeadsQuery,
  useSuccessPaymentMutation,
} from "@/queries/clientLeadQueries"
import { GetClientsFilters } from "@/types/clients"

export const useCreateClientLead = () => {
  return useCreateClientLeadMutation()
}

export const useGetClientLeads = (type: "internal" | "client", filters?: GetClientsFilters) => {
  const { data, isLoading, error } = useGetClientLeadsQuery(type, filters)
  return { data: data?.data || {}, isLoading, error }
}

export const useSuccessPayment = () => {
  return useSuccessPaymentMutation()
}
