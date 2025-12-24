import { createTicketSchema } from "@/types/schema/support"
import z from "zod"

export type PriorityType = "low" | "medium" | "high"
export type Status = "open" | "resolved"

export type Ticket = {
  id: string
  title: string
  description: string
  category: string
  created_by: string
  subject: string
  priority: PriorityType
  status: Status
  updated_at: string
  created_at: string
  attachments?: TicketAttachment[]
}

export type TicketAttachment = {
  id: string
  name: string
  sizeKB: number
  mime?: string
  url?: string
}

export type CreateTicketValues = z.infer<typeof createTicketSchema>
