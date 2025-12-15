import { createBusinessInfo, getBusinessInfo } from "@/api/business-info"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getApiErrorMessage } from "@/utils/formatAxiosError"
import { toast } from "sonner"

export const useGetBusinessInfoQuery = () => {
  return useQuery({
    queryKey: ["business-info"],
    queryFn: getBusinessInfo,
  })
}

export const useCreateBusinessInfoMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBusinessInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-info"] })
      toast.success("Business Information saved successfully")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}
