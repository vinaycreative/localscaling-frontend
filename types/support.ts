export type Ticket = {
  id: string
  title: string
  description: string
  category: string
  created_by: string
  subject: string
  priority: "low" | "medium" | "high"
  status: "open" | "resolved"
  updated_at: string
  attachments?: TicketAttachment[] 
}

export type TicketAttachment = {
  id: string
  name: string
  sizeKB: number
  mime?: string
  url?: string
}
