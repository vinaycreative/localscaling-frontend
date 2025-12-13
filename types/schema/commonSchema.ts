import { z } from "zod"

/**
 * Generic reusable schema for API responses
 * Use: ApiResponseSchema(z.array(MySchema))
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    success: z.literal(true),
    message: z.string(),
    data,
  })

// Optionally add a fallback schema for error handling too
export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string().optional(),
})

export const createApiResponseUnion = <T extends z.ZodTypeAny>(data: T) =>
  z.union([ApiResponseSchema(data), ApiErrorResponseSchema])
