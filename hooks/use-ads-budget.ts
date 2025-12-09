import { useAdsBudgetQuery, useCreateAdsBudgetMutation } from "@/queries/ads-budget-queries"

export const useAdsBudget = () => {
  const { data, isLoading, error } = useAdsBudgetQuery()
  return { data, isLoading, error }
}

export const useCreateAdsBudget = () => {
  const { mutateAsync: createAdsBudget, error, isPending } = useCreateAdsBudgetMutation()
  return { createAdsBudget, error, isPending }
}
