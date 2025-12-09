
import { useCreateWebsiteSetupMutation, useWebsiteSetupQuery } from "@/queries/website-setup-queries"

export const useWebsiteSetup = () => {
  const { data, isLoading, error } = useWebsiteSetupQuery()
  return { data, isLoading, error }
}

export const useCreateWebsiteSetup = () => {
  const { mutateAsync: createWebsiteSetup, error, isPending } = useCreateWebsiteSetupMutation()
  return { createWebsiteSetup, error, isPending }
}