import { useQuery, useMutation } from "@tanstack/react-query"
import {
  getGoogleAnalytics4Properties,
  getIntegrations,
  verifyGa4Connect,
  disconnectGoogleIntegration,
} from "@/api/integrations"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/utils/formatAxiosError"

export const useIntegrations = () => {
  return useQuery({
    queryKey: ["integrations"],
    queryFn: getIntegrations,
  })
}

// Google Analytics 4
export const useGoogleAnalytics4PropertiesQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ["google-analytics-4-properties", id],
    queryFn: () => getGoogleAnalytics4Properties(id || ""),
    enabled: !!id && id !== "undefined",
  })
}

export const useVerifyGa4ConnectMutation = () => {
  return useMutation({
    mutationFn: (payload: { integrationId: string; propertyId: string; propertyName: string }) =>
      verifyGa4Connect(payload.integrationId, payload.propertyId, payload.propertyName),
    onSuccess: () => {
      toast.success("GA4 connection verified successfully")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

export const useDisconnectGoogleIntegrationMutation = () => {
  return useMutation({
    mutationFn: (integrationId: string) => disconnectGoogleIntegration(integrationId),
    onSuccess: () => {
      toast.success("Google integration disconnected successfully")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}
