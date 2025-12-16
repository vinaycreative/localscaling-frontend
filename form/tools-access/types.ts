import z from "zod"
import { toolsAccessSchema } from "./schema"

export type ToolsAccessFormValues = z.infer<typeof toolsAccessSchema>
