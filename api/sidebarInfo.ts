import { api } from "@/lib/api"

export async function getSidebarInformation() {
  const res = await api.get("/client/info/field-are-left-in-each-section")
  return res.data
}
