import { createWebsiteSetup, getWebsiteSetup } from "@/api/websiteSetup"
import { getApiErrorMessage } from "@/utils/formatAxiosError"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useWebsiteSetupQuery = () => {
  return useQuery({
    queryKey: ["website-setup"],
    queryFn: getWebsiteSetup,
  })
}

export const useCreateWebsiteSetupMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createWebsiteSetup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["website-setup"] })
      queryClient.invalidateQueries({ queryKey: ["sidebar-information"] })
      toast.success("Website setup saved successfully!")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}
