import {
  useLocationAndBudgetQuery,
  useCreateLocationAndBudgetMutation,
} from "@/queries/locationAndBudgetQueries"

export const useLocationAndBudget = () => {
  const { data, isLoading, error } = useLocationAndBudgetQuery()
  return { data: data?.data || {}, isLoading, error }
}

export const useCreateLocationAndBudget = () => {
  const {
    mutateAsync: createLocationAndBudget,
    error,
    isPending,
  } = useCreateLocationAndBudgetMutation()
  return { createLocationAndBudget, error, isPending }
}
