import z from "zod";
import { LocationsBudgetSchema } from "./schema";

export type LocationsBudgetFormValues = z.infer<typeof LocationsBudgetSchema>
