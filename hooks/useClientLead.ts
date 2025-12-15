import {
  useCreateClientLeadMutation,
  useGetClientLeadsQuery,
  useSuccessPaymentMutation,
} from "@/queries/clientLeadQueries"

export const useCreateClientLead = () => {
  return useCreateClientLeadMutation()
}

export const useGetClientLeads = (type: "internal" | "client") => {
  const { data, isLoading, error } = useGetClientLeadsQuery(type)
  return { data: data?.data?.data, isLoading, error }
}

export const useSuccessPayment = () => {
  return useSuccessPaymentMutation()
}
