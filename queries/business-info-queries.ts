import { createBusinessInfo, getBusinessInfo } from "@/api/business-info"
import { BUSINESS_INFO_KEY } from "@/constants/query-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useGetBusinessInfoQuery = () => {
  return useQuery({
    queryKey: [BUSINESS_INFO_KEY],
    queryFn: getBusinessInfo,
  })
}

export const useCreateBusinessInfoMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBusinessInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUSINESS_INFO_KEY] })
      toast.success("Business Information saved successfully")
    },
    onError: (error) => {
      //   toast.error(getApiErrorMessage(error))
    },
  })
}
