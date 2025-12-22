"use client"
import LegalAssetUploader from "@/components/reusable/legal-asset-uploader"
import LegalLinkInput from "@/components/reusable/legal-link-input"
import { TagInput } from "@/components/reusable/tags/tag-input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { domainProviders } from "@/constants/website-setup"
import { uploadFileToStorage } from "@/lib/storage"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { Fragment, useEffect, useState } from "react"
import { useForm, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { useCreateWebsiteSetup, useWebsiteSetup } from "@/hooks/useWebsiteSetup"
import FormLayout from "@/components/ui/form-layout"
import { WebsiteSetupSchema, WebsiteSetupForm } from "./schema"
import { useLoggedInUser } from "@/hooks/useAuth"
import LoadingState from "@/components/reusable/tags/loading-state"
import { showFormErrors } from "@/lib/errors"

export default function WebsiteSetupOnboardingForm() {
  const router = useRouter()
  const { user } = useLoggedInUser()
  const { data: websiteSetupData, isLoading: websiteSetupLoading } = useWebsiteSetup()

  const { createWebsiteSetup, isPending: isSubmitting } = useCreateWebsiteSetup()

  const [existingLegalFileUrls, setExistingLegalFileUrls] = useState<string[]>([])

  const form = useForm<WebsiteSetupForm>({
    resolver: zodResolver(WebsiteSetupSchema) as Resolver<WebsiteSetupForm>,
    defaultValues: {
      domain_provider: "",
      access_granted: false,
      business_clients_worked: [],
      legal_files: [],
      legal_links: [],
      seo_locations: [],
    },
  })

  const watch = form.watch()
  const {
    formState: { errors },
  } = form

  useEffect(() => {
    console.log("🔍 [DEBUG] websiteSetupData received:", websiteSetupData)
    console.log("🔍 [DEBUG] websiteSetupData type:", typeof websiteSetupData)
    console.log(
      "🔍 [DEBUG] websiteSetupData keys:",
      websiteSetupData ? Object.keys(websiteSetupData) : []
    )

    if (!websiteSetupData) {
      console.log("⚠️ [DEBUG] No websiteSetupData")
      return
    }

    // Handle nested data structure (data?.data?.data from hook)
    const rawData = websiteSetupData as WebsiteSetupForm
    const actualData = rawData || rawData

    if (!actualData || (typeof actualData === "object" && Object.keys(actualData).length === 0)) {
      console.log("⚠️ [DEBUG] No actual data found")
      return
    }

    console.log("📦 [DEBUG] Actual data extracted:", actualData)

    // Type assertion: API returns WebsiteSetupForm plus metadata fields
    const data = actualData as WebsiteSetupForm & {
      id?: string
      user_id?: string
      created_at?: string
      updated_at?: string
    }

    console.log("📦 [DEBUG] Typed data:", {
      domain_provider: data?.domain_provider,
      access_granted: data?.access_granted,
      business_clients_worked: data?.business_clients_worked,
      legal_links: data?.legal_links,
      legal_files: data?.legal_files,
      seo_locations: data?.seo_locations,
    })

    // Validate and format domain_provider to match available options
    const getDomainProvider = (): string => {
      if (!data?.domain_provider) {
        console.log("⚠️ [DEBUG] No domain_provider in data")
        return ""
      }
      const providerValue = String(data.domain_provider).trim()
      console.log("🔍 [DEBUG] Provider value from API:", providerValue)
      console.log("🔍 [DEBUG] Available providers:", domainProviders)

      // Check if the provider exists in available options (case-insensitive match)
      const isValidProvider = domainProviders.some(
        (provider) => provider.toLowerCase() === providerValue.toLowerCase()
      )
      console.log("✅ [DEBUG] Is valid provider:", isValidProvider)

      if (isValidProvider) {
        // Return the exact match from domainProviders array to ensure case consistency
        const matchedProvider =
          domainProviders.find(
            (provider) => provider.toLowerCase() === providerValue.toLowerCase()
          ) || ""
        console.log("✅ [DEBUG] Matched provider:", matchedProvider)
        return matchedProvider
      }
      console.log("❌ [DEBUG] Provider not found in options, returning original:", providerValue)
      return providerValue // Return original if not found, let user see what was saved
    }

    // Extract only form fields, excluding API metadata fields
    // legal_files from API are URLs (strings), but form expects File objects or empty array
    // We'll store the URLs separately in existingLegalFileUrls state
    const formFields: WebsiteSetupForm = {
      domain_provider: getDomainProvider(),
      access_granted: Boolean(data?.access_granted),
      business_clients_worked: Array.isArray(data?.business_clients_worked)
        ? data.business_clients_worked.filter((item): item is string => typeof item === "string")
        : [],
      legal_links: Array.isArray(data?.legal_links)
        ? data.legal_links.filter((item): item is string => typeof item === "string")
        : [],
      legal_files: [], // Form expects File objects, URLs are handled separately
      seo_locations: Array.isArray(data?.seo_locations)
        ? data.seo_locations.filter((item): item is string => typeof item === "string")
        : [],
    }

    console.log("📝 [DEBUG] Form fields to set:", formFields)

    // Extract existing legal file URLs (these are already uploaded)
    if (Array.isArray(data?.legal_files)) {
      const urls = data.legal_files.filter((x): x is string => typeof x === "string")
      console.log("📎 [DEBUG] Existing legal file URLs:", urls)
      setExistingLegalFileUrls(urls)
    } else {
      setExistingLegalFileUrls([])
    }

    // Reset form with loaded data - use full object, not partial
    console.log("🔄 [DEBUG] Resetting form with:", formFields)
    form.reset(formFields)

    // Verify form values after reset
    setTimeout(() => {
      const currentValues = form.getValues()
      console.log("✅ [DEBUG] Form values after reset:", currentValues)
      console.log("✅ [DEBUG] Form errors:", form.formState.errors)
    }, 100)
  }, [websiteSetupData, form])

  const onSubmit = async (values: WebsiteSetupForm) => {
    try {
      // be explicit about the return type
      const data = values

      // Upload new legal files (only File instances)
      let newFileUrls: string[] = []

      const filesToUpload = (data.legal_files || []).filter((f): f is File => f instanceof File)

      if (filesToUpload.length > 0) {
        const uploadPromises = filesToUpload.map((file: File) =>
          uploadFileToStorage(file, `legal-${file.name}`, user?.id ?? "")
        )
        newFileUrls = await Promise.all(uploadPromises)
      }

      // Combine existing + new
      const allLegalFiles = [...existingLegalFileUrls, ...newFileUrls]

      const payload: WebsiteSetupForm = {
        domain_provider: data.domain_provider,
        access_granted: data.access_granted,
        business_clients_worked: data.business_clients_worked,
        legal_links: data.legal_links || [],
        seo_locations: data.seo_locations,
        legal_files: allLegalFiles,
      }

      await createWebsiteSetup(payload)

      router.push("/tasks/tools-access")
    } catch (error) {
      console.log(error)
    }
  }

  const handlePrev = () => router.push("/tasks/branding-content")

  if (websiteSetupLoading) {
    return <LoadingState />
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          showFormErrors(errors)
        })}
        className="overflow-scroll"
      >
        <FormLayout
          footer={
            <Fragment>
              <Button type="button" variant="outline" onClick={handlePrev} disabled={isSubmitting}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground"
              >
                {isSubmitting ? (
                  <>
                    Saving...
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </Fragment>
          }
        >
          <Fragment>
            {/* DOMAIN PROVIDER */}
            <FormField
              control={form.control}
              name="domain_provider"
              render={({ field }) => {
                console.log("🎯 [DEBUG] Domain provider field value:", field.value)
                return (
                  <FormItem className="space-y-2">
                    <Label>
                      Domain provider <span className="text-destructive">*</span>
                    </Label>
                    <FormControl>
                      <Select
                        key={field.value || "empty"} // Force re-render when value changes
                        value={field.value || undefined}
                        onValueChange={(val) => {
                          console.log("🔄 [DEBUG] Domain provider changed to:", val)
                          field.onChange(val)
                          form.setValue("access_granted", false)
                        }}
                      >
                        <SelectTrigger className="w-full rounded cursor-pointer focus-visible:ring-[0px]">
                          <SelectValue placeholder="Select domain provider" />
                        </SelectTrigger>
                        <SelectContent className="rounded">
                          {domainProviders?.map((domain) => (
                            <SelectItem key={domain} value={domain}>
                              {domain}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            {/* GRANT ACCESS BUTTON */}
            <Button
              type="button"
              variant={watch.access_granted ? "default" : "outline"}
              onClick={() => form.setValue("access_granted", !watch.access_granted)}
              disabled={!watch.domain_provider}
            >
              {watch.access_granted ? "Granted" : "Grant access"}
            </Button>

            {/* CLIENTS WORKED WITH */}
            <FormField
              control={form.control}
              name="business_clients_worked"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TagInput
                      label="Business Clients Worked"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="e.g., Google, Amazon"
                      required={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LEGAL FILES */}
            <FormField
              control={form.control}
              name="legal_files"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LegalAssetUploader
                      label="Legal Asset Uploader"
                      multiple
                      maxFiles={5}
                      value={field.value as File[]}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {existingLegalFileUrls.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {existingLegalFileUrls.length} file(s) already uploaded.
              </p>
            )}

            {/* LEGAL LINKS */}
            <FormField
              control={form.control}
              name="legal_links"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LegalLinkInput
                      value={field.value as string[]}
                      onChange={(val) => {
                        field.onChange(val)
                      }}
                      errors={errors?.legal_links}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SEO LOCATIONS */}
            <FormField
              control={form.control}
              name="seo_locations"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TagInput
                      label="Most Important Locations for SEO"
                      value={field.value}
                      onChange={field.onChange}
                      required={true}
                      placeholder="Enter SEO Location"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Fragment>
        </FormLayout>
      </form>
    </Form>
  )
}
