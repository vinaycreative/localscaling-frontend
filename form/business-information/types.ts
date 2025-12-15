import z from "zod"
import { businessInformationFormSchema } from "./schema"

export type BusinessInformationFormValues = z.infer<typeof businessInformationFormSchema>
