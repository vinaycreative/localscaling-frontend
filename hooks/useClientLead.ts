import {
  useCreateClientLeadMutation,
  useGetClientLeadsQuery,
  useSuccessPaymentMutation,
} from "@/queries/clientLeadQueries"

export const useCreateClientLead = () => {
  return useCreateClientLeadMutation()
}

export const useGetClientLeads = () => {
  const { data, isLoading, error } = useGetClientLeadsQuery()
  return { data: data?.data?.data, isLoading, error }
}

export const useSuccessPayment = () => {
  return useSuccessPaymentMutation()
}
