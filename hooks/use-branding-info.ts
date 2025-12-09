import { useBrandingInfoQuery, useCreateBrandingInfoQuery } from "@/queries/branding-info-queries"

export const useBrandingInfo = () => {
  const { data, isLoading, error } = useBrandingInfoQuery()
  return { data, isLoading, error }
}

export const useCreateBrandingInfo = () => {
  const { mutateAsync: createBrandingInfo, error, isPending } = useCreateBrandingInfoQuery()
  return { createBrandingInfo, error, isPending }
}
