import { getClientProfile } from "@/api/client-profile"
import { useQuery } from "@tanstack/react-query"

export const useGetClientProfileQuery = (id: string) => {
  return useQuery({
    queryKey: ["client-profile", id],
    queryFn: () => getClientProfile(id),
    enabled: !!id,
  })
}
