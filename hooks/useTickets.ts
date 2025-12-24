import { useGetTicketsQuery, useCreateTicketMutation } from "@/queries/ticketQueries"

export const useGetTickets = () => {
  const { data, isLoading, error } = useGetTicketsQuery()
  return { data, isLoading, error }
}

export const useCreateTicket = () => {
  const { mutateAsync: createTicket, error, isPending } = useCreateTicketMutation()
  return { createTicket, error, isPending }
}
