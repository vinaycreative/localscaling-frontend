"use client"

import { createWebsiteSetup, getWebsiteSetup, WebsiteSetupPayload } from "@/api/website-setup"
import LegalAssetUploader from "@/components/reusable/legal-asset-uploader"
import LegalLinkInput from "@/components/reusable/legal-link-input"
import OnboardingVideo from "@/components/reusable/onboarding-video"
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
import React, { useEffect, useState } from "react"
import { toast } from "sonner"

import { z } from "zod"
import { useForm, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { useCreateWebsiteSetup, useWebsiteSetup } from "@/hooks/use-website-setup"

const WebsiteSetupSchema = z.object({
  access_granted: z.boolean(),
  domain_provider: z.string().min(1, { message: "Domain provider is required" }),
  business_clients_worked: z.array(z.string()).default([]),
  legal_links: z.array(z.string().url({ message: "Invalid URL in legal links" })).default([]),
  // allow both string (existing uploaded URLs) and File (new uploads)
  legal_files: z.array(z.any()).default([]),
  seo_locations: z.array(z.string()).default([]),
})

// Explicit TS type that matches how we actually use the form values
type WebsiteSetupForm = {
  access_granted: boolean
  domain_provider: string
  business_clients_worked: string[]
  legal_links: string[]
  // legal_files can be existing URLs (string) or new File objects
  legal_files: (File | string)[]
  seo_locations: string[]
}

export default function WebsiteSetupPage() {
  const router = useRouter()

  const {
    data: websiteSetupData,
    isLoading: websiteSetupLoading,
    error: websiteSetupError,
  } = useWebsiteSetup()

  const {
    createWebsiteSetup,
    isPending: isSubmitting,
    error: createwebsiteSetupError,
  } = useCreateWebsiteSetup()

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
  console.log("🚀 ~ WebsiteSetupPage ~ errors:", errors)

  useEffect(() => {
    // Defensive: websiteSetupData?.data might be an object of key -> value
    if (!websiteSetupData) return
    const data = websiteSetupData.data || {}
    // if data is an array of keys (original code), handle both shapes:
    if (Array.isArray(data)) {
      // If API returned an array of keys for some reason, skip
      return
    } else {
      const keys = Object.keys(data)
      keys.forEach((key) => {
        // only set values that exist in the form to avoid runtime errors
        if ((form.getValues() as any)[key] !== undefined) {
          form.setValue(key as any, (data as any)[key])
        }
      })

      // If backend returned existing uploaded file URLs, populate existingLegalFileUrls
      if (Array.isArray((data as any).legal_files)) {
        const urls = ((data as any).legal_files as any[]).filter((x) => typeof x === "string")
        setExistingLegalFileUrls(urls)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websiteSetupData])

  const onSubmit = async (values: WebsiteSetupForm) => {
    try {
      // be explicit about the return type
      const data = form.getValues() as WebsiteSetupForm

      // Upload new legal files (only File instances)
      let newFileUrls: string[] = []

      const filesToUpload = (data.legal_files || []).filter((f): f is File => f instanceof File)

      if (filesToUpload.length > 0) {
        const uploadPromises = filesToUpload.map((file) => uploadFileToStorage(file, "documents"))
        newFileUrls = await Promise.all(uploadPromises)
      }

      // Combine existing + new
      const allLegalFiles = [...existingLegalFileUrls, ...newFileUrls]

      const payload: WebsiteSetupPayload = {
        domain_provider: data.domain_provider,
        access_granted: data.access_granted,
        business_clients_worked: data.business_clients_worked,
        legal_links: data.legal_links || [],
        seo_locations: data.seo_locations,
        legal_files: allLegalFiles,
      }

      await createWebsiteSetup(payload)

      toast.success("Website setup saved successfully!")
      router.push("/tasks/tools-access")
    } catch (error) {
      console.error(error)
      toast.error("Failed to save changes.")
    } finally {
    }
  }

  const handlePrev = () => router.push("/tasks/branding-content")

  if (websiteSetupLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full h-full grid lg:grid-cols-[auto_1fr] gap-4 overflow-hidden pt-4"
      >
        <OnboardingVideo
          title="3. Website Setup"
          subTitle="Define your project scope and objectives."
        />

        <div className="rounded-lg border-border border bg-background w-full h-full grid grid-rows-[auto_60px] overflow-hidden">
          {/* SCROLL AREA */}
          <div className="p-6 h-full overflow-y-scroll flex flex-col gap-4">
            {/* DOMAIN PROVIDER */}
            <FormField
              control={form.control}
              name="domain_provider"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label>
                    Domain provider <span className="text-primary">*</span>
                  </Label>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
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
              )}
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
                      value={field.value as any[]}
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
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex p-2 pt-4 gap-2 justify-end border-t">
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
          </div>
        </div>
      </form>
    </Form>
  )
}
