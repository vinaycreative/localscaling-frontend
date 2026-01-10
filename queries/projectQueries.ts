import { createProjects, getProjects } from "@/api/projects"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getApiErrorMessage } from "@/utils/formatAxiosError"
import { toast } from "sonner"
import { ProjectsFilters } from "@/types/projects"

export const useProjectsQuery = (filters?: ProjectsFilters) => {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: () => {
      return getProjects(filters)
    },
  })
}

export const useCreateProjectsMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProjects,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}
