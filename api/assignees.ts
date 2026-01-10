import { api } from "@/lib/api"

export async function getAssignees() {
  try {
    const res = await api.get(`/admin/tickets/assignees`)
    return res.data
  } catch (error) {
    console.error("Error fetching tickets Assignees", error)
    return null
  }
}
