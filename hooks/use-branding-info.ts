import {
  useBrandingInfoQuery,
  useCreateBrandingInfoMutation,
} from "@/queries/branding-info-queries"

export const useBrandingInfo = () => {
  const { data, isLoading, error } = useBrandingInfoQuery()
  return { data: data?.data || {}, isLoading, error }
}

export const useCreateBrandingInfo = () => {
  const { mutateAsync: createBrandingInfo, error, isPending } = useCreateBrandingInfoMutation()
  return { createBrandingInfo, error, isPending }
}
