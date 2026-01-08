import { useQuery } from "@tanstack/react-query"
import { getAssignees } from "@/api/assignees"

export const useGetAssigneesQuery = () => {
  return useQuery({
    queryKey: ["assignees"],
    queryFn: getAssignees,
  })
}
