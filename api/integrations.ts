import { api } from "@/lib/api"

export const getIntegrations = async () => {
  const res = await api.get("/client/integrations/status")
  return res.data.data
}

// Google Analytics 4
export const getGa4Connect = async () => {
  const res = await api.get("/client/integrations/google/ga4/connect")
  return res.data
}

export const selectGoogleAnalytics4Property = async (
  integrationId: string,
  propertyId: string
) => {
  const res = await api.post(
    `/client/integrations/google/ga4/${integrationId}/properties/${propertyId}/select`
  )
  return res.data
}
export const verifyGa4Connect = async (
  integrationId: string,
  propertyId: string,
  propertyName: string
) => {
  const res = await api.post(`/client/integrations/google/ga4/${integrationId}/verify`, {
    property_id: propertyId,
    property_name: propertyName,
  })
  return res.data
}

export const getGtmConnect = async () => {
  const res = await api.get("/client/integrations/google/gtm/connect")
  return res.data
}

export const createGtmConnect = async (data: unknown) => {
  const res = await api.post("/client/integrations/google/gtm/connect", data)
  return res.data
}

export const getGoogleAdsConnect = async () => {
  const res = await api.get("/client/integrations/google/google-ads/connect")
  return res.data
}

export const createGoogleAdsConnect = async (data: unknown) => {
  const res = await api.post("/client/integrations/google/google-ads/connect", data)
  return res.data
}

export const getGoogleSearchConsoleConnect = async () => {
  const res = await api.get("/client/integrations/google/search-console/connect")
  return res.data
}

export const createGoogleSearchConsoleConnect = async (data: unknown) => {
  const res = await api.post("/client/integrations/google/search-console/connect", data)
  return res.data
}

export const getPipedriveConnect = async () => {
  const res = await api.get("/client/integrations/pipedrive/connect")
  return res.data
}

export const createPipedriveConnect = async (data: unknown) => {
  const res = await api.post("/client/integrations/pipedrive/connect", data)
  return res.data
}

export const getCalConnect = async () => {
  const res = await api.get("/client/integrations/cal/connect")
  return res.data
}

export const createCalConnect = async (data: unknown) => {
  const res = await api.post("/client/integrations/cal/connect", data)
  return res.data
}

export const getGoogleDriveConnect = async () => {
  const res = await api.get("/client/integrations/google/drive/connect")
  return res.data
}

// Google Analytics 4
export const getGoogleAnalytics4Properties = async (id: string) => {
  const res = await api.get(`/client/integrations/google/ga4/${id}/properties`)
  return res.data.data
}
