import { useGetAssigneesQuery } from "@/queries/assigneesQueries"

export const useGetAssignees = () => {
  const { data, isLoading, error, isFetching, isRefetching } = useGetAssigneesQuery()
  return { data: data?.data, isLoading, error, isFetching, isRefetching 
    
  }
}
