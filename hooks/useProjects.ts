import { useCreateProjectsMutation, useProjectsQuery } from "@/queries/projectQueries"
import { ProjectsFilters } from "@/types/projects"

export const useProjects = (filters?: ProjectsFilters) => {
  console.log("🚀 ~ useProjects ~ filters:", filters)
  const { data, isLoading, error } = useProjectsQuery(filters)
  return { data: data?.data, isLoading, error }
}

export const useCreateProjects = () => {
  const { mutateAsync: createProjects, error, isPending } = useCreateProjectsMutation()
  return { createProjects, error, isPending }
}
