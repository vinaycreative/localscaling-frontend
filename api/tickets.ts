import { cleanFilters } from "@/components/data-table/utils"
import { api } from "@/lib/api"
import { logError } from "@/lib/utils"
import {
  BulkUpdateTicketsPayload,
  CreateTicketPayload,
  TicketFilters,
  UpdateTicketPayload,
} from "@/types/support"

export async function getTickets({
  filters,
  type,
}: {
  filters: TicketFilters
  type: "client" | "internal" | undefined
}) {
  try {
    const route = type === "internal" && type ? "admin" : "client"
    const res = await api.get(`/${route}/tickets`, {
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

export async function updateTicket(payload: UpdateTicketPayload) {
  try {
    const { id, ...rest } = payload
    const { data } = await api.put(`/admin/tickets/${id}`, rest)
    return data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save branding information")
  }
}

export async function bulkUpdateTickets(payload: BulkUpdateTicketsPayload) {
  try {
    const { data } = await api.put(`/admin/tickets/bulk-update`, payload)
    return data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save branding information")
  }
}
