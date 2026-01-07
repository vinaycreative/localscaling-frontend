export type Project = {
  id: string
  name: string
  stage: string
  assignee: string
  due_date: string
  status: "completed" | "delayed" | "pending"
}
export type ProjectsFilters = {
  page: number
  perPage?: number
  name?: string | null
  stage?: string | null
  assignee?: string | null
  status?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type CreateProjectsPayload = {
  name: string
  stage: string
  assignee: string
  due_date: string
  status: "completed" | "delayed" | "pending"
}
