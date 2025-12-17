import { useCreateWebsiteSetupMutation, useWebsiteSetupQuery } from "@/queries/websiteSetupQueries"

export const useWebsiteSetup = () => {
  const { data, isLoading, error } = useWebsiteSetupQuery()
  return { data: data?.data?.data, isLoading, error }
}

export const useCreateWebsiteSetup = () => {
  const { mutateAsync: createWebsiteSetup, error, isPending } = useCreateWebsiteSetupMutation()
  return { createWebsiteSetup, error, isPending }
}
