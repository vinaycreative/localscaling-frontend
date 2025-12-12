import { useCreateNewClientsMutation, useGetClientsQuery } from "@/queries/client-queries"

export const useGetClients = () => {
  const { data, isLoading, error } = useGetClientsQuery()
  return { data, isLoading, error }
}

export const useCreateNewClients = () => {
  const { mutateAsync: createNewClients, error, isPending } = useCreateNewClientsMutation()
  return { createNewClients, error, isPending }
}
