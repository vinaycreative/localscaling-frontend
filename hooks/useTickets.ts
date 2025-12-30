import { useGetTicketsQuery, useCreateTicketMutation } from "@/queries/ticketQueries"
import { TicketFilters } from "@/types/support"

export const useGetTickets = ({ filters }: { filters: TicketFilters }) => {
  const { data, isLoading, error } = useGetTicketsQuery({ filters })
  return { data: data?.data, isLoading, error }
}

export const useCreateTicket = () => {
  const { mutateAsync: createTicket, error, isPending } = useCreateTicketMutation()
  return { createTicket, error, isPending }
}
