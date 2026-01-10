import { createTicket, getTickets, updateTicket } from "@/api/tickets"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getApiErrorMessage } from "@/utils/formatAxiosError"
import { toast } from "sonner"
import { TicketFilters } from "@/types/support"

export const useGetTicketsQuery = ({
  filters,
  type,
}: {
  filters: TicketFilters
  type: "client" | "internal" | undefined
}) => {
  return useQuery({
    queryKey: ["tickets", filters, type],
    queryFn: () => {
      return getTickets({ filters, type })
    },
    enabled: type ? true : false,
  })
}

export const useCreateTicketMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

export const useUpdateTicketMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}
