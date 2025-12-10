
import { useCreateToolsAccessMutation, useToolsAccessQuery } from "@/queries/tool-access-queries"

export const useToolsAccess = () => {
  const { data, isLoading, error } = useToolsAccessQuery()
  return { data, isLoading, error }
}

export const useCreateToolsAccess = () => {
  const { mutateAsync: createToolsAccess, error, isPending } = useCreateToolsAccessMutation()
  return { createToolsAccess, error, isPending }
}