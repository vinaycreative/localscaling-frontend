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
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Fragment, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ToolsAccessFormValues } from "./types"
import { toolsAccessSchema } from "./schema"
import { AccessToolField } from "./components/accessToolField"
import { Ga4ConnectButton } from "@/components/integrations/Ga4ConnectButton"
import { useIntegrations, useVerifyGa4ConnectMutation } from "@/queries/integrationsQueries"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import { Ga4PropertySelectModal } from "@/components/integrations/Ga4PropertySelectModal"

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
    icon: null,
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

  const {
    data: toolsAccessData,
    isLoading: toolsAccessLoading,
    error: toolsAccessError,
  } = useToolsAccess()

  const { data: integrationsData, isLoading: integrationsLoading } = useIntegrations()
  const { mutateAsync: verifyGa4ConnectMutation, isPending: verifyGa4ConnectPending } =
    useVerifyGa4ConnectMutation()

  // Find GA4 integration
  const ga4Integration = integrationsData?.find((integration: any) => integration.tool === "ga4")
  const ga4IntegrationId = ga4Integration?.integration_id

  // Modal state
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false)

  // Handle connection click
  const handleConnect = (tool: string, provider: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
    const normalizedTool = tool?.toLowerCase().trim()
    let connectUrl = ""

    if (provider?.toLowerCase() === "google") {
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
    } else {
      toast.error(`Provider "${provider}" not supported`)
      return
    }

    if (connectUrl) {
      window.location.href = connectUrl
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
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
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
      {/* <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-scroll">
          <FormLayout
            footer={
              <Fragment>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded bg-transparent cursor-pointer group"
                  onClick={handlePrev}
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-all duration-300" />
                  Previous
                </Button>

                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer group"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
                </Button>
              </Fragment>
            }
          >
            {ACCESS_TOOLS.map((tool) => (
              <FormField
                key={tool.key as keyof ToolsAccessFormValues}
                control={form.control}
                name={tool.key as keyof ToolsAccessFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <AccessToolField
                        field={field}
                        title={tool.title}
                        iconSrc={tool.icon}
                        buttonText={tool.buttonText}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </FormLayout>
        </form>
      </Form> */}
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
              const isConnected =
                integration.integration_id ||
                integration.status?.toLowerCase() === "connected" ||
                integration.status?.toLowerCase() === "active"
              const isPending = integration.status?.toLowerCase() === "pending"

              return (
                <Card
                  key={integration.integration_id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {integration.tool && (
                          <div className="relative w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                            <Image
                              src={`/assets/${integration.tool}.png`}
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
                        </div>
                      </div>
                      <Badge
                        variant={statusInfo.variant}
                        className={`${statusInfo.className} text-xs font-medium py-1.5`}
                      >
                        {isPending && <Clock className="w-3 h-3 mr-1" />}
                        {!isPending && isConnected && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        {integration.connected_at && (
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
                      </div>
                      {integration.tool === "ga4" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => setIsPropertyModalOpen(true)}
                          disabled={!ga4IntegrationId}
                        >
                          Select Properties
                        </Button>
                      )}
                      <Button
                        variant={isConnected ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleConnect(integration.tool, integration.provider)}
                        disabled={isPending}
                        className="gap-2"
                      >
                        {isConnected ? (
                          <>
                            <ExternalLink className="w-3.5 h-3.5" />
                            Reconnect
                          </>
                        ) : isPending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-3.5 h-3.5" />
                            Connect
                          </>
                        )}
                      </Button>
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
