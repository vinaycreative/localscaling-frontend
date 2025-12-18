import { useGetSidebarInfoQuery } from "@/queries/sidebarInfoQueries"

export const useSidebarInfo = () => {
  const { data, isLoading, error } = useGetSidebarInfoQuery()
  return { data: data?.data || {}, isLoading, error }
}
