import { BRANDING_INFO_KEY } from "@/constants/query-keys"
import { getBrandingInfo, saveBrandingInfo } from "@/api/branding-info"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useBrandingInfoQuery = () => {
  return useQuery({
    queryKey: [BRANDING_INFO_KEY],
    queryFn: getBrandingInfo,
  })
}

export const useCreateBrandingInfoQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveBrandingInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BRANDING_INFO_KEY] })
      toast.success("Branding Information saved successfully")
    },
    onError: (error) => {
      //   toast.error(getApiErrorMessage(error))
    },
  })
}
