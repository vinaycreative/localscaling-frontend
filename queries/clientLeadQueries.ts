import { createClientLead, getClientLeads } from "@/api/clientLeads"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export const useCreateClientLeadMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: createClientLead,
    onSuccess: () => {
      toast.success("Client lead created successfully")
      router.push("/clients")
      queryClient.invalidateQueries({ queryKey: ["client-leads"] })
    },
    onError: (error) => {
      toast.error("Failed to create client lead")
    },
  })
}

export const useGetClientLeadsQuery = () => {
  return useQuery({
    queryKey: ["client-leads"],
    queryFn: getClientLeads,
  })
}
