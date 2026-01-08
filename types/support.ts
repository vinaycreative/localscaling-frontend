import { createTicketSchema } from "@/types/schema/support"
import z from "zod"

export type PriorityType = "low" | "medium" | "high"
export type Status = "open" | "resolved"

export type CreatedBy = {
  first_name: string
  last_name: string
}

export type AssignedTo = {
  first_name: string
  last_name: string
}

export type Ticket = {
  id: string
  title: string
  description: string
  category: string
  created_by: CreatedBy
  assigned_to: AssignedTo
  subject: string
  priority: PriorityType
  status: Status
  updated_at: string
  created_at: string
  attachments?: TicketAttachment[]
  files?: string[]
}

export type TicketAttachment = {
  id: string
  name: string
  sizeKB: number
  mime?: string
  url?: string
}

export type TicketFilters = {
  page?: number
  perPage?: number
  title?: string | null
  subject?: string | null
  category?: string[] | null
  priority?: string | null
  status?: string | null
  created_at?: string | null
}

export type CreateTicketValues = z.infer<typeof createTicketSchema>
export type CreateTicketPayload = {
  title: string
  category: string
  priority: "low" | "medium" | "high"
  description: string
  files?: string[] | undefined
}
