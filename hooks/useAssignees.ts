import { useGetAssigneesQuery } from "@/queries/assigneesQueries"

export const useGetAssignees = () => {
  const { data, isLoading, error } = useGetAssigneesQuery()
  return { data: data?.data, isLoading, error }
}
