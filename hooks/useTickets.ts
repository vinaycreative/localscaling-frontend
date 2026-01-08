import { useGetTicketsQuery, useCreateTicketMutation } from "@/queries/ticketQueries"
import { TicketFilters } from "@/types/support"
import { useLoggedInUser } from "./useAuth"

export const useGetTickets = ({ filters }: { filters: TicketFilters }) => {
  const { user } = useLoggedInUser()
  console.log("🚀 ~ useGetTickets ~ user:", user?.type)
  const { data, isLoading, error } = useGetTicketsQuery({ filters, type: user?.type })
  return { data: data?.data, isLoading, error }
}

export const useCreateTicket = () => {
  const { mutateAsync: createTicket, error, isPending } = useCreateTicketMutation()
  return { createTicket, error, isPending }
}
