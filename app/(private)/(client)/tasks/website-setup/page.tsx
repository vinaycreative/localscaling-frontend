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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { useCreateWebsiteSetup, useWebsiteSetup } from "@/hooks/use-website-setup"

const WebsiteSetupSchema = z.object({
  domainProvider: z.string().min(1, "Domain provider is required"),
  accessGranted: z.boolean(),
  businessClientsWorked: z.array(z.string().min(1)).min(1, "At least one client is required"),
  legalLinks: z.array(z.string().url("Invalid link")).min(1, "At least one Links is required"),
  seoLocations: z.array(z.string().min(1)).min(1, "Add at least one SEO location"),
  legalFiles: z.array(z.any()).optional(), // file array handled separately
})

type WebsiteSetupForm = z.infer<typeof WebsiteSetupSchema>

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
    resolver: zodResolver(WebsiteSetupSchema),
    defaultValues: {
      domainProvider: "",
      accessGranted: false,
      businessClientsWorked: [],
      legalFiles: [],
      legalLinks: [],
      seoLocations: [],
    },
  })

  const watch = form.watch()
  const {
    formState: { errors },
  } = form
  console.log("🚀 ~ WebsiteSetupPage ~ errors:", errors)

  useEffect(() => {
    const loadData = async () => {
      if (websiteSetupData) {
        let keys = websiteSetupData?.data || {}
        let data = websiteSetupData?.data
        keys?.forEach((el: any) => {
          form.setValue(el, data[el])
        })
      }
    }

    if (websiteSetupData) {
      loadData()
    }
  }, [websiteSetupData])

  const onSubmit = async (values: WebsiteSetupForm) => {
    
    try {
      const data = form.getValues()

      // Upload new legal files
      let newFileUrls: string[] = []

      if (data.legalFiles && data.legalFiles.length > 0) {
        const uploadPromises = Array.from(data.legalFiles).map((file: File) =>
          uploadFileToStorage(file, "documents")
        )
        newFileUrls = await Promise.all(uploadPromises)
      }

      // Combine existing + new
      const allLegalFiles = [...existingLegalFileUrls, ...newFileUrls]

      const payload: WebsiteSetupPayload = {
        domainProvider: data.domainProvider,
        accessGranted: data.accessGranted,
        businessClientsWorked: data.businessClientsWorked,
        legalLinks: data.legalLinks || [],
        seoLocations: data.seoLocations,
        legalFiles: allLegalFiles,
      }

      await createWebsiteSetup(payload)

      toast.success("Website setup saved successfully!")
      router.push("/tasks/tools-access")
    } catch (error) {
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
              name="domainProvider"
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
                        form.setValue("accessGranted", false)
                      }}
                    >
                      <SelectTrigger className="w-full rounded cursor-pointer focus-visible:ring-[0px]">
                        <SelectValue placeholder="Select domain provider" />
                      </SelectTrigger>
                      <SelectContent className="rounded">
                        {domainProviders.map((domain) => (
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
              variant={watch.accessGranted ? "default" : "outline"}
              onClick={() => form.setValue("accessGranted", !watch.accessGranted)}
              disabled={!watch.domainProvider}
            >
              {watch.accessGranted ? "Granted" : "Grant access"}
            </Button>

            {/* CLIENTS WORKED WITH */}
            <FormField
              control={form.control}
              name="businessClientsWorked"
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
              name="legalFiles"
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
              name="legalLinks"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LegalLinkInput
                      value={field.value as string[]}
                      onChange={(val) => {
                        field.onChange(val)
                      }}
                      errors={errors?.legalLinks}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SEO LOCATIONS */}
            <FormField
              control={form.control}
              name="seoLocations"
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
