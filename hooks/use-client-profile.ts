// import { useGetClientProfileQuery } from "@/queries/client-profile-queries"

import { useGetClientProfileQuery } from "@/queries/client-profile-queries"

export const useClientProfile = (id: string) => {
  const { data, isLoading, error } = useGetClientProfileQuery(id)
  return { data: data || {}, isLoading, error }
}
