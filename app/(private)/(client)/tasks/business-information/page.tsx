"use client"

import { useEffect, useState } from "react"
import { file, z } from "zod"
import { useRouter } from "next/navigation"

import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import OnboardingVideo from "@/components/reusable/onboarding-video"
import { ChevronRight, Loader2, Mail, CircleQuestionMark } from "lucide-react"
import { CustomInput } from "@/components/reusable/custom-input"
import { useBusinessInfo, useCreateBusinessInfo } from "@/hooks/use-business-info"

const businessInformationFormSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  start_year: z.string().min(1, "Start year is required"),
  street_address: z.string().min(1, "Street address is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  vat_id: z.string().min(1, "VAT ID is required"),
  contact_name: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email"),
  contact_number: z.string().min(1, "Contact number is required"),
  whatsapp_number: z.string().optional(),
  website: z.string().min(1).url("Invalid URL"),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  google_business_profile_link: z.string().optional(),
})

const generateYearOptions = (startYear: number, endYear: number) => {
  const years = []
  for (let year = endYear; year >= startYear; year--) {
    years.push(year.toString())
  }
  return years
}
const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS_VALUES = generateYearOptions(1900, CURRENT_YEAR)

const YEAR_OPTIONS = YEAR_OPTIONS_VALUES.map((year) => ({
  value: year,
  label: year,
}))

export default function BusinessInformationPage() {
  const router = useRouter()

  const {
    data: businessInfoData,
    isLoading: businessInfoLoading,
    error: businessInfoError,
  } = useBusinessInfo()

  const {
    createBusinessInfo,
    isPending: isSubmitting,
    error: createBusinessInfoError,
  } = useCreateBusinessInfo()

  const form = useForm<z.infer<typeof businessInformationFormSchema>>({
    resolver: zodResolver(businessInformationFormSchema),
    defaultValues: {
      company: "",
      start_year: "",
      street_address: "",
      postal_code: "",
      city: "",
      state: "",
      country: "",
      vat_id: "",
      contact_name: "",
      email: "",
      contact_number: "",
      whatsapp_number: "",
      website: "",
      facebook: "",
      instagram: "",
      twitter: "",
      google_business_profile_link: "",
    },
  })

  useEffect(() => {
    const loadData = async () => {
      if (businessInfoData) {
        let keys = businessInfoData?.data || {}
        let data = businessInfoData?.data
        keys?.forEach((el: any) => {
          form.setValue(el, data[el])
        })
      }
    }

    if (businessInfoData) {
      loadData()
    }
  }, [businessInfoData])

  const onSubmit = async (values: z.infer<typeof businessInformationFormSchema>) => {
    try {
      await createBusinessInfo(values as any)
      toast.success("Business information saved!")
      router.push("/tasks/branding-content")
    } catch (error) {
      toast.error("Failed to save. Please try again.")
    } finally {
    }
  }

  if (businessInfoLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin textcus-primary" />
      </div>
    )
  }

  return (
    <section className="w-full h-full grid lg:grid-cols-[auto_1fr] gap-4 overflow-hidden pt-4">
      <OnboardingVideo
        title="1. General Business Information"
        subTitle="Provide essential company details."
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-lg border-border border bg-background w-full h-full grid grid-rows-[auto_60px] overflow-hidden"
        >
          <div className="p-6 h-full grid grid-cols-2 overflow-y-scroll gap-4">
            {/* Company */}
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      label="Company Name"
                      id={field?.name}
                      type="text"
                      required={true}
                      value={field.value}
                      onChange={field?.onChange}
                      placeholder="Company Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Year */}
            <FormField
              control={form.control}
              name="start_year"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      label="Company Start Year"
                      id={field?.name}
                      placeholder="Year"
                      required={true}
                      value={field.value}
                      select={true}
                      selectOptions={YEAR_OPTIONS}
                      onSelectChange={(value) => field.onChange(field?.name, value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Street Address */}
            <FormField
              control={form.control}
              name="street_address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      label="Street Address"
                      id={field?.name}
                      type="text"
                      placeholder="123 Main St"
                      required={true}
                      value={field.value}
                      onChange={field?.onChange}
                      className="col-span-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Postal Code */}
            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      label="Postal Code"
                      id={field?.name}
                      type="text"
                      placeholder="10001"
                      required={true}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      label="City"
                      id={field?.name}
                      type="text"
                      placeholder="New York"
                      required={true}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      label="State"
                      id={field.name}
                      type="text"
                      placeholder="NY"
                      required={true}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      label="Country"
                      id={field.name}
                      type="text"
                      placeholder="USA"
                      required={true}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* VAT ID */}
            <FormField
              control={form.control}
              name="vat_id"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <CustomInput
                      label="VAT ID"
                      id="vatId"
                      type="text"
                      placeholder="DE123456789"
                      required={true}
                      value={field.value}
                      onChange={field.onChange}
                      className="col-span-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Fields */}
            <FormField
              name="contact_name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      label="Contact name"
                      id={field?.name}
                      type="text"
                      placeholder="Contact Name"
                      required={true}
                      value={field.value}
                      onChange={field?.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      label="Contact email"
                      id={field.name}
                      type="email"
                      placeholder="info@yourcompany.com"
                      required={true}
                      value={field.value}
                      onChange={field.onChange}
                      PrefixIcon={Mail}
                      SuffixIcon={CircleQuestionMark}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="contact_number"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      label="Contact number"
                      id={field?.name}
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      required={true}
                      value={field.value}
                      onChange={field.onChange}
                      prefixText={"DE"}
                      SuffixIcon={CircleQuestionMark}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="whatsapp_number"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      label="Whatsapp number"
                      id="whatsappNumber"
                      type="text"
                      placeholder="+44 (555) 000-0000"
                      required={false}
                      value={field?.value ?? ""}
                      onChange={field.onChange}
                      prefixText={"DE"}
                      SuffixIcon={CircleQuestionMark}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Website + Social Links */}
            {["website", "facebook", "instagram", "twitter", "googleBusinessProfileLink"].map(
              (fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName as any}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      {/* <FormLabel>{fieldName.replace(/([A-Z])/g, " $1")}</FormLabel> */}
                      <FormControl>
                        <CustomInput
                          id={fieldName}
                          type="text"
                          value={field.value}
                          label={fieldName.replace(/([A-Z])/g, " $1")}
                          required={false}
                          placeholder={`Enter ${fieldName} link`}
                          prefixText={"http://"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            )}
          </div>

          {/* Submit Button */}
          <div className="px-4 border-t flex items-center justify-end">
            <Button type="submit" disabled={isSubmitting} className="rounded bg-primary text-white">
              {isSubmitting ? "Saving..." : "Next"}
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}
