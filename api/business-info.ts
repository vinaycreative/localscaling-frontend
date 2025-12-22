import { businessInformationFormSchema } from "@/form/business-information/schema"
import { BusinessInformationFormValues } from "@/form/business-information/types"
import { api } from "@/lib/api"
import { logError } from "@/lib/utils"
import { ApiErrorResponseSchema, ApiResponseSchema } from "@/types/schema/commonSchema"
import z from "zod"

const GetBusinessInfoResponseSchema = z.union([
  ApiResponseSchema(businessInformationFormSchema),
  ApiErrorResponseSchema,
])

export type GetBusinessInfoResponse = z.infer<typeof GetBusinessInfoResponseSchema>

export async function getBusinessInfo() :Promise<GetBusinessInfoResponse> {
  try {
    const res = await api.get("/client/info/business-info")
    return res.data.data
  } catch (error) {
    logError(error)

    return {
      success: false,
      message: "Failed to fetch business information",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function createBusinessInfo(data: BusinessInformationFormValues) {
  try {
    console.log("data is ", data)
    const res = await api.post("/client/info/business-info", data)
    return res.data
  } catch (error) {
    logError(error)
    throw new Error("Failed to save business information")
  }
}
