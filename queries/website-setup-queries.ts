import { createWebsiteSetup, getWebsiteSetup } from "@/api/website-setup"
import { WESBITE_SETUP_KEY } from "@/constants/query-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useWebsiteSetupQuery = () => {
  return useQuery({
    queryKey: [WESBITE_SETUP_KEY],
    queryFn: getWebsiteSetup,
  })
}

export const useCreateWebsiteSetupMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createWebsiteSetup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WESBITE_SETUP_KEY] })
      toast.success("Business Information saved successfully")
    },
    onError: (error) => {
      //   toast.error(getApiErrorMessage(error))
    },
  })
}
