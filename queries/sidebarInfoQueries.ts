import { getSidebarInformation } from "@/api/sidebarInfo"
import { useQuery } from "@tanstack/react-query"

export const useGetSidebarInfoQuery = () => {
  return useQuery({
    queryKey: ["sidebar-information"],
    queryFn: getSidebarInformation,
  })
}
