import z from "zod"

export const createTicketSchema = z.object({
  title: z.string().min(2, "Please enter a title"),
  category: z.string().min(1, "Select a category"),
  priority: z.enum(["low", "medium", "high"]),
  description: z.string().min(10, "Please add a little more detail"),
  files: z.custom<File[] | undefined>().optional(),
})