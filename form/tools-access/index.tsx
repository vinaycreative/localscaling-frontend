"use client"

import OnboardingVideo from "@/components/reusable/onboarding-video"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import FormLayout from "@/components/ui/form-layout"
import { Label } from "@/components/ui/label"
import { useCreateToolsAccess, useToolsAccess } from "@/hooks/use-tools-access"
// import { ToolsAccessForm } from "@/interfaces/onboarding/tools-access"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ToolsAccessFormValues } from "./types"
import { toolsAccessSchema } from "./schema"
import { AccessToolField } from "./components/accessToolField"

export const ACCESS_TOOLS = [
  {
    key: "google_ads_access_granted",
    title: "Google Ads",
    icon: "/google-ads.png",
    buttonText: "Grant Google Ads access",
  },
  {
    key: "gtm_access_granted",
    title: "Google Tag Manager (GTM)",
    icon: "/google-tag.svg",
    buttonText: "Grant GTM access",
  },
  {
    key: "ga4_access_granted",
    title: "Google Analytics 4 (GA4)",
    icon: "/google-analytics.png",
    buttonText: "Grant GA4 access",
  },
  {
    key: "google_search_console_access_granted",
    title: "Google Search Console",
    icon: null,
    buttonText: "Grant Google Search Console access",
  },
] as const

function ToolsAccessForm() {
  const router = useRouter()

  const {
    data: toolsAccessData,
    isLoading: toolsAccessLoading,
    error: toolsAccessError,
  } = useToolsAccess()

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
      const keys = Object.keys(toolsAccessData || {})
      const data = toolsAccessData || {}
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

  return (
    <section className="w-full h-full grid lg:grid-cols-[auto_1fr] gap-4 overflow-hidden pt-4">
      <OnboardingVideo
        title="4. Tools Access"
        subTitle="Enable analytics and performance tracking."
      />
      <Form {...form}>
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
      </Form>
    </section>
  )
}

export default ToolsAccessForm
