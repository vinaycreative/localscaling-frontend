"use client"

import OnboardingVideo from "@/components/reusable/onboarding-video"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import FormLayout from "@/components/ui/form-layout"
import { Label } from "@/components/ui/label"
import { useCreateToolsAccess, useToolsAccess } from "@/hooks/use-tools-access"
// import { ToolsAccessForm } from "@/interfaces/onboarding/tools-access"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock,
  ExternalLink,
  XCircle,
  TriangleAlert,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Fragment, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ToolsAccessFormValues } from "./types"
import { toolsAccessSchema } from "./schema"
import Link from "next/link"
import { AccessToolField } from "./components/accessToolField"
import { Ga4ConnectButton } from "@/components/integrations/Ga4ConnectButton"
import {
  useDisconnectGoogleIntegrationMutation,
  useIntegrations,
  useVerifyGa4ConnectMutation,
} from "@/queries/integrationsQueries"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import { Ga4PropertySelectModal } from "@/components/integrations/Ga4PropertySelectModal"
import { useQueryClient } from "@tanstack/react-query"

export const ACCESS_TOOLS = [
  {
    key: "google_ads_access_granted",
    title: "Google Ads",
    icon: "/google-ads.png",
    buttonText: "Grant Google Ads access",
    toolKey: "ads", // Backend tool identifier
  },
  {
    key: "gtm_access_granted",
    title: "Google Tag Manager (GTM)",
    icon: "/google-tag.png",
    buttonText: "Grant GTM access",
    toolKey: "gtm",
  },
  {
    key: "ga4_access_granted",
    title: "Google Analytics 4 (GA4)",
    icon: "/google-analytics.png",
    buttonText: "Grant GA4 access",
    toolKey: "ga4",
  },
  {
    key: "google_search_console_access_granted",
    title: "Google Search Console",
    icon: "/google-search.png",
    buttonText: "Grant Google Search Console access",
    toolKey: "search-console",
  },
] as const

// Helper function to map backend tool name to ACCESS_TOOLS config
const getToolConfig = (toolName: string) => {
  const normalizedToolName = toolName?.toLowerCase().trim()
  const toolMap: Record<string, (typeof ACCESS_TOOLS)[number]> = {
    ga4: ACCESS_TOOLS.find((t) => t.toolKey === "ga4")!,
    gtm: ACCESS_TOOLS.find((t) => t.toolKey === "gtm")!,
    ads: ACCESS_TOOLS.find((t) => t.toolKey === "ads")!,
    "search-console": ACCESS_TOOLS.find((t) => t.toolKey === "search-console")!,
    search_console: ACCESS_TOOLS.find((t) => t.toolKey === "search-console")!,
    google_ads: ACCESS_TOOLS.find((t) => t.toolKey === "ads")!,
    google_analytics: ACCESS_TOOLS.find((t) => t.toolKey === "ga4")!,
  }
  return (
    toolMap[normalizedToolName] || {
      title: toolName?.charAt(0).toUpperCase() + toolName?.slice(1) || "Unknown Tool",
      icon: null,
      buttonText: `Grant ${toolName || "access"}`,
      toolKey: normalizedToolName || "unknown",
    }
  )
}

// Helper function to get status badge variant
const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "connected":
    case "active":
      return {
        variant: "default" as const,
        label: "Connected",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      }
    case "pending":
      return {
        variant: "secondary" as const,
        label: "Pending",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      }
    case "revoked":
      return {
        variant: "destructive" as const,
        label: "Revoked",
        className: "bg-rose-50 text-rose-700 border-rose-200",
      }
    case "disconnected":
    case "inactive":
      return {
        variant: "outline" as const,
        label: "Disconnected",
        className: "bg-gray-50 text-gray-700 border-gray-200",
      }
    default:
      return {
        variant: "outline" as const,
        label: status || "Not Connected",
        className: "bg-gray-50 text-gray-700 border-gray-200",
      }
  }
}

function ToolsAccessForm() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    data: toolsAccessData,
    isLoading: toolsAccessLoading,
    error: toolsAccessError,
  } = useToolsAccess()

  const { data: integrationsData, isLoading: integrationsLoading } = useIntegrations()
  const { mutateAsync: verifyGa4ConnectMutation, isPending: verifyGa4ConnectPending } =
    useVerifyGa4ConnectMutation()
  const {
    mutateAsync: disconnectGoogleIntegration,
    isPending: disconnectGoogleIntegrationPending,
  } = useDisconnectGoogleIntegrationMutation()

  // Find GA4 integration
  const ga4Integration = integrationsData?.find((integration: any) => integration.tool === "ga4")
  const ga4IntegrationId = ga4Integration?.integration_id

  // Modal state
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false)
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null)

  // Handle connection click
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
  const handleConnect = (tool: string, provider: string) => {
    const normalizedTool = tool?.toLowerCase().trim()
    const normalizedProvider = provider?.toLowerCase().trim()
    let connectUrl = ""

    switch (normalizedProvider) {
      case "google":
        switch (normalizedTool) {
          case "ga4":
          case "google_analytics":
            connectUrl = `${baseUrl}/client/integrations/google/ga4/connect`
            break
          case "gtm":
            connectUrl = `${baseUrl}/client/integrations/google/gtm/connect`
            break
          case "ads":
          case "google_ads":
            connectUrl = `${baseUrl}/client/integrations/google/google-ads/connect`
            break
          case "search-console":
          case "search_console":
            connectUrl = `${baseUrl}/client/integrations/google/search-console/connect`
            break
          default:
            toast.error(`Connection URL not configured for tool: ${tool}`)
            return
        }
        break
      case "webflow":
        if (normalizedTool === "webflow") {
          connectUrl = `${baseUrl}/client/integrations/webflow/connect`
        } else {
          toast.error(`Connection URL not configured for tool: ${tool}`)
          return
        }
        break
      default:
        toast.error(`Provider "${provider}" not supported`)
        return
    }

    if (connectUrl) {
      window.location.href = connectUrl
    }
  }

  const handleDisconnect = async (integrationId?: string, toolName?: string) => {
    if (!integrationId) return

    const toolConfig = getToolConfig(toolName || "")
    const confirmed = window.confirm(
      `Disconnect ${toolConfig.title}? You can reconnect anytime from here.`
    )
    if (!confirmed) return

    try {
      setDisconnectingId(integrationId)
      await disconnectGoogleIntegration(integrationId)
      await queryClient.invalidateQueries({ queryKey: ["integrations"] })
    } catch (error) {
      // handled by mutation toast
    } finally {
      setDisconnectingId(null)
    }
  }

  const { createToolsAccess, isPending, error: createToolsAccessError } = useCreateToolsAccess()

  const form = useForm<ToolsAccessFormValues>({
    resolver: zodResolver(toolsAccessSchema),
    defaultValues: {
      google_ads_access_granted: false,
      gtm_access_granted: false,
      ga4_access_granted: false,
      google_search_console_access_granted: false,
    },
  })

  const {
    formState: { isSubmitting },
  } = form

  const handlePrev = () => {
    router.push("/tasks/website-setup")
  }

  const onSubmit = async (values: ToolsAccessFormValues) => {
    try {
      const payload: ToolsAccessFormValues = {
        ...values,
      }
      await createToolsAccess(values)
      toast.success("Website setup saved successfully!")
      handleNext()
    } catch (error) {
      toast.error("Failed to save changes.")
    } finally {
    }
  }

  const handleNext = () => {
    router.push("/tasks/locations-budget")
  }

  useEffect(() => {
    if (toolsAccessData && !toolsAccessLoading) {
      let keys = Object.keys(toolsAccessData || {})
      let data = toolsAccessData || {}
      keys.forEach((key) => {
        form.setValue(key as keyof ToolsAccessFormValues, data?.[key])
      })
    }
  }, [toolsAccessData, toolsAccessLoading])

  if (toolsAccessLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center pt-4 bg-white rounded-lg border border-gray-300">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }
  console.log(integrationsData, "integrationsData")

  return (
    <section className="w-full h-full grid lg:grid-cols-[auto_1fr] gap-4 overflow-hidden pt-4">
      <OnboardingVideo
        title="4. Tools Access"
        subTitle="Enable analytics and performance tracking."
      />
      <div className="bg-white p-6 rounded-lg border border-gray-300">
        {integrationsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : integrationsData && integrationsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrationsData.map((integration: any) => {
              const toolConfig = getToolConfig(integration.tool)
              const statusInfo = getStatusBadge(integration.status)
              const statusLower = integration.status?.toLowerCase()
              const isConnected = statusLower
                ? statusLower === "connected" || statusLower === "active"
                : !!integration.integration_id
              const isPending = statusLower === "pending"
              const isRevoked = statusLower === "revoked"
              const isDisconnecting =
                disconnectGoogleIntegrationPending &&
                disconnectingId === integration.integration_id

              return (
                <Card
                  key={integration.integration_id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {integration.tool && (
                          <div className="relative w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                            <Image
                              src={
                                integration.tool === "ga4" ? "/google-analytics.png" : integration.tool === "google_ads" ? "/google-ads.png" : integration.tool === "google_search_console" ? "/google-search.png" : integration.tool === "gtm" ? "/google-tag.png" : integration.tool === "search_console" ? "/google-search.png" : integration.tool === "webflow" ? "/webflow.png" : "/placeholder.svg"                          
                              }
                              alt={integration.tool}
                              width={32}
                              height={32}
                              className="object-contain"
                            />    
                          </div>
                        )}               
                        <div>
                          <CardTitle className="text-base font-semibold">
                            {toolConfig.title}
                          </CardTitle>
                          {integration.external_account_name && (
                            <CardDescription className="text-xs mt-0.5">
                              {integration.external_account_name}
                            </CardDescription>
                          )}
                          {integration.provider && (
                            <p className="text-[11px] text-muted-foreground">
                              Provider: {integration.provider}
                            </p>
                          )}
                        </div>
                      </div>
                      {statusInfo.label !== "not_connected" && (
                        <Badge
                          variant={statusInfo.variant}
                          className={`${statusInfo.className} text-xs font-medium py-1.5`}
                        >
                          {statusInfo.label}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        {integration.connected_at && isConnected && (
                          <p className="text-xs text-muted-foreground">
                            Connected{" "}
                            {formatDate(integration.connected_at, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        )}
                        {!integration.connected_at && isPending && (
                          <p className="text-xs text-muted-foreground">
                            Connection in progress...
                          </p>
                        )}
                        {/* {isRevoked && (
                          <p className="text-xs text-rose-700">
                            Access was revoked. Reconnect to restore sync.
                          </p>
                        )} */}
                        {!isConnected && !isPending && !isRevoked && (
                          <p className="text-xs text-muted-foreground">
                            Not connected yet. Connect to enable automations.
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {/* {integration.tool === "ga4" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => setIsPropertyModalOpen(true)}
                            disabled={!ga4IntegrationId}
                          >
                            Select Properties
                          </Button>
                        )} */}
                        <Button
                          variant={isConnected ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleConnect(integration.tool, integration.provider)}
                          disabled={isDisconnecting}
                          className="gap-2"
                        >
                          {isConnected ? (
                            <>
                              <ExternalLink className="w-3.5 h-3.5" />
                              Reconnect
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-3.5 h-3.5" />
                              Connect
                            </>
                          )}
                        </Button>
                        {isConnected && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDisconnect(integration.integration_id, integration.tool)
                            }
                            disabled={isDisconnecting}
                            className="gap-2 text-destructive hover:text-destructive"
                          >
                            {isDisconnecting ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Disconnecting...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                Disconnect
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No integrations found</p>
          </div>
        )}
      </div>

      {/* GA4 Property Selection Modal */}
      {ga4IntegrationId && (
        <Ga4PropertySelectModal
          open={isPropertyModalOpen}
          onOpenChange={setIsPropertyModalOpen}
          integrationId={ga4IntegrationId}
          onVerifyGa4Connect={verifyGa4ConnectMutation}
          onSuccess={() => {
            // Optionally refetch integrations data to show updated state
            // This would require adding a refetch function from the query
          }}
        />
      )}
    </section>
  )
}

export default ToolsAccessForm
