import { z } from "zod"
import { ApiResponseSchema } from "@/types/schema/commonSchema"

export const RoleEnum = z.enum(["client", "admin", "support_admin", "support_head_admin"]) // matches constants/auth.ts
export const AuthUserSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string().nullable(),
  email: z.string().email(),
  role: RoleEnum,
})

export const LoginResponseSchema = ApiResponseSchema(AuthUserSchema)

export type AuthUser = z.infer<typeof AuthUserSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
