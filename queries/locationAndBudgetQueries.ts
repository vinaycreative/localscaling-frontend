import { createLocationAndBudget, getLocationAndBudget } from "@/api/adsBudget"
import { getApiErrorMessage } from "@/utils/formatAxiosError"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useLocationAndBudgetQuery = () => {
  return useQuery({
    queryKey: ["location-and-budget"],
    queryFn: getLocationAndBudget,
  })
}

export const useCreateLocationAndBudgetMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createLocationAndBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["location-and-budget"] })
      queryClient.invalidateQueries({ queryKey: ["sidebar-information"] })
      toast.success("Location and budget saved successfully")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}
