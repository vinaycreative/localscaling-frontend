import { createNewClients, getNewClients } from "@/api/clients"
import { CLIENTS } from "@/constants/query-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useGetClientsQuery = () => {
  return useQuery({
    queryKey: [CLIENTS],
    queryFn: getNewClients,
  })
}

export const useCreateNewClientsMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createNewClients,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS] })
      toast.success("Branding Information saved successfully")
    },
    onError: (error) => {
      //   toast.error(getApiErrorMessage(error))
    },
  })
}
