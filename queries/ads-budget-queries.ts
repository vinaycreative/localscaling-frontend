import { createAdsBudget, getAdsBudget } from "@/api/ads-budget"
import { ADS_BUDGET_KEY } from "@/constants/query-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useAdsBudgetQuery = () => {
  return useQuery({
    queryKey: [ADS_BUDGET_KEY],
    queryFn: getAdsBudget,
  })
}

export const useCreateAdsBudgetMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAdsBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADS_BUDGET_KEY] })
      toast.success("Branding Information saved successfully")
    },
    onError: (error) => {
      //   toast.error(getApiErrorMessage(error))
    },
  })
}
