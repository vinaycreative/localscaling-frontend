"use client"

import OnboardingVideo from "@/components/reusable/onboarding-video"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { useCreateToolsAccess, useToolsAccess } from "@/hooks/use-tools-access"
import { ToolsAccessForm } from "@/interfaces/onboarding/tools-access"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

type AccessToolFieldProps = {
  field: any
  title: string
  iconSrc: string | null
  buttonText: string
}

const AccessToolField = ({ field, title, iconSrc, buttonText }: AccessToolFieldProps) => (
  <div className="space-y-2">
    <Label className="font-medium">{title}</Label>

    <Button
      type="button"
      variant={field.value ? "default" : "outline"}
      className="rounded px-4 cursor-pointer transition-all duration-300 flex items-center gap-3"
      onClick={() => field.onChange(!field.value)}
    >
      {iconSrc && (
        <Image
          src={iconSrc}
          alt={title}
          width={20}
          height={20}
          className="w-5 h-5 object-contain"
        />
      )}
      {buttonText}
    </Button>
  </div>
)

const ACCESS_TOOLS = [
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

const ToolsAccessSchema = z.object({
  google_ads_access_granted: z.boolean(),
  gtm_access_granted: z.boolean(),
  ga4_access_granted: z.boolean(),
  google_search_console_access_granted: z.boolean(),
})

function ToolsAccessPage() {
  const router = useRouter()

  const {
    data: toolsAccessData,
    isLoading: toolsAccessLoading,
    error: toolsAccessError,
  } = useToolsAccess()

  const {
    createToolsAccess,
    isPending: isSubmitting,
    error: createToolsAccessError,
  } = useCreateToolsAccess()

  const form = useForm<z.infer<typeof ToolsAccessSchema>>({
    resolver: zodResolver(ToolsAccessSchema),
    defaultValues: {
      google_ads_access_granted: false,
      gtm_access_granted: false,
      ga4_access_granted: false,
      google_search_console_access_granted: false,
    },
  })

  const handlePrev = () => {
    router.push("/tasks/website-setup")
  }

  const onSubmit = async (values: ToolsAccessForm) => {
    try {
      const payload: ToolsAccessForm = {
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
    if (toolsAccessData?.data && !toolsAccessLoading) {
      let keys = Object.keys(toolsAccessData?.data || {})
      let data = toolsAccessData?.data || []
      keys.forEach((key) => {
        form.setValue(key as keyof ToolsAccessForm, data?.[key])
      })
    }
  }, [toolsAccessData?.data])

  if (toolsAccessLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full h-full grid lg:grid-cols-[auto_1fr] gap-4 overflow-hidden pt-4"
        >
          <OnboardingVideo
            title="4. Tools Access"
            subTitle="Enable analytics and performance tracking."
          />

          <div className="rounded-lg border-border border bg-background w-full h-full grid grid-rows-[auto_60px] overflow-hidden">
            {/* SCROLL AREA */}
            <div className="p-6 h-full overflow-y-scroll flex flex-col gap-4">
              {ACCESS_TOOLS.map((tool) => (
                <FormField
                  key={tool.key as keyof ToolsAccessForm}
                  control={form.control}
                  name={tool.key as keyof ToolsAccessForm}
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
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex p-2 pt-4 gap-2 justify-end border-t">
              <Button
                type="button"
                variant="outline"
                className="rounded bg-transparent cursor-pointer group"
                onClick={handlePrev}
              >
                <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-all duration-300" />
                Previous
              </Button>

              <Button
                type="submit"
                className="rounded bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer group"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}

export default ToolsAccessPage
