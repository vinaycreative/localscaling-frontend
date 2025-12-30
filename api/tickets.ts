import { cleanFilters } from "@/components/data-table/utils"
import { api } from "@/lib/api"
import { logError } from "@/lib/utils"
import { CreateTicketPayload, TicketFilters } from "@/types/support"

export async function getTickets({ filters }: { filters: TicketFilters }) {
  try {
    const res = await api.get("/client/tickets", {
      params: cleanFilters(filters as TicketFilters),
    })
    return res.data
  } catch (error) {
    console.error("Error fetching tickets", error)
    return null
  }
}

export async function createTicket(data: CreateTicketPayload) {
  try {
    console.log("Saving Branding Data:", data)
    const res = await api.post("/client/tickets", { ...data })
    return res.data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save branding information")
  }
}
