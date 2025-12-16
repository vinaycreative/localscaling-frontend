import { createToolsAccess, getToolsAccess } from "@/api/tools-access"
import { TOOLS_ACCESS } from "@/constants/query-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useToolsAccessQuery = () => {
  return useQuery({
    queryKey: [TOOLS_ACCESS],
    queryFn: getToolsAccess,
  })
}

export const useCreateToolsAccessMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createToolsAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TOOLS_ACCESS] })
      toast.success("Tools Access Configuration Saved Successfully.")
    },
    onError: (error) => {
      //   toast.error(getApiErrorMessage(error))
    },
  })
}
