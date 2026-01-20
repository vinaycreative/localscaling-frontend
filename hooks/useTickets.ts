import {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
} from "@/queries/ticketQueries"
import { TicketFilters } from "@/types/support"
import { useLoggedInUser } from "./useAuth"

export const useGetTickets = ({ filters }: { filters: TicketFilters }) => {
  const { user } = useLoggedInUser()
  const { data, isLoading, error, isPending, ...rest } = useGetTicketsQuery({
    filters,
    type: user?.type,
  })
  return { data: data?.data, isLoading, error, isPending, ...rest }
}

export const useCreateTicket = () => {
  const { mutateAsync: createTicket, error, isPending , ...rest } = useCreateTicketMutation()
  return { createTicket, error, isPending, ...rest }
}

export const useUpdateTicket = () => {
  const { mutateAsync: updateTicket, error, isPending , ...rest } = useUpdateTicketMutation()
  return { updateTicket, error, isPending, ...rest }
}
