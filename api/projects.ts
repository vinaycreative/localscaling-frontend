import { cleanFilters } from "@/components/data-table/utils"
import { api } from "@/lib/api"
import { logError } from "@/lib/utils"
import { CreateProjectsPayload, ProjectsFilters } from "@/types/projects"

export async function getProjects(filters?: ProjectsFilters) {
  try {
    const res = await api.get("/admin/projects", {
      params: cleanFilters(filters as ProjectsFilters),
    })
    return res.data
  } catch (error) {
    console.error("Error fetching projects", error)
    return null
  }
}

export async function createProjects(data: CreateProjectsPayload) {
  try {
    console.log("Saving Projects Data:", data)
    const res = await api.post("/admin/projects", { ...data })
    return res.data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save branding information")
  }
}
