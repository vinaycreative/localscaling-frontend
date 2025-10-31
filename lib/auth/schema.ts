import { z } from "zod"

export const RoleEnum = z.enum(["CLIENT", "SUPPORT_HEAD_ADMIN", "SUPPORT_ADMIN", "ADMIN"]) // matches constants/auth.ts

export const ApiUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: RoleEnum,
})

export type ApiUser = z.infer<typeof ApiUserSchema>

export const MeResponseSchema = z.object({
  user: ApiUserSchema,
})


