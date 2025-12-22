import {
  useCreateBusinessInfoMutation,
  useGetBusinessInfoQuery,
} from "@/queries/businessInfoQueries"

export const useBusinessInfo = () => {
  const { data, isLoading, error } = useGetBusinessInfoQuery()
  return { data, isLoading, error }
}

export const useCreateBusinessInfo = () => {
  const { mutateAsync: createBusinessInfo, error, isPending } = useCreateBusinessInfoMutation()
  return { createBusinessInfo, error, isPending }
}
