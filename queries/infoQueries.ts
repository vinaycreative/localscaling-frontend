import { getBusinessInformation } from "@/api/info"
import { useQuery } from "@tanstack/react-query"

export const useGetBusinessInformationQuery = () => {
  return useQuery({
    queryKey: ["business-information-count"],
    queryFn: getBusinessInformation,
  })
}
