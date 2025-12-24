import { api } from "@/lib/api"
import { logError } from "@/lib/utils"
import { CreateTicketValues } from "@/types/support"

export async function getTickets() {
  try {
    const res = await api.get("/client/tickets")
    return res.data
  } catch (error) {
    console.error("Error fetching branding info", error)
    return null
  }
}

export async function createTicket(data: CreateTicketValues) {
  try {
    console.log("Saving Branding Data:", data)
    const res = await api.post("/client/tickets", { ...data })
    return res.data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save branding information")
  }
}
