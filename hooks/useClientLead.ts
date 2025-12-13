import { useCreateClientLeadMutation, useGetClientLeadsQuery } from "@/queries/clientLeadQueries"

export const useCreateClientLead = () => {
  return useCreateClientLeadMutation()
}

export const useGetClientLeads = () => {
  const { data, isLoading, error } = useGetClientLeadsQuery()
  return { data: data?.data?.data, isLoading, error }
}
