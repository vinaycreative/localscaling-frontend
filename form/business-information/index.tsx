"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ChevronRight,
  Loader2,
  Mail,
  CircleQuestionMark,
  Building2,
  MapPin,
  Phone,
  Globe,
} from "lucide-react"
import { CustomInput } from "@/components/reusable/custom-input"
import { useBusinessInfo, useCreateBusinessInfo } from "@/hooks/useBusinessInfo"
import { normalizedUrl } from "@/lib/utils"
import FormLayout from "@/components/ui/form-layout"
import { businessInformationFormSchema } from "./schema"
import { BusinessInformationFormValues } from "./types"
import { showFormErrors } from "@/lib/errors"

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
  value: year.toString(),
  label: year.toString(),
}))

type SocialFieldName = "website" | "facebook" | "instagram" | "x" | "google_business_profile_link"

const socialFields: readonly SocialFieldName[] = [
  "website",
  "facebook",
  "instagram",
  "x",
  "google_business_profile_link",
]

export default function BusinessInformationForm() {
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

  const isEmpty = Object.keys(businessInfoData || {})?.length > 0

  const form = useForm<BusinessInformationFormValues>({
    resolver: zodResolver(businessInformationFormSchema),
    defaultValues: {
      company_name: "",
      start_year: "",
      address: "",
      postal_code: "",
      city: "",
      state: "",
      country: "",
      vat_id: "",
      contact_name: "",
      contact_email: "",
      contact_number: "",
      whatsapp_number: "",
      website: "",
      facebook: "",
      instagram: "",
      x: "",
      google_business_profile_link: "",
    },
  })

  useEffect(() => {
    if (businessInfoData && Object.keys(businessInfoData).length > 0) {
      // Type assertion: API returns BusinessInformationFormValues plus metadata fields
      const data = businessInfoData as unknown as BusinessInformationFormValues & {
        id?: string
        created_at?: string
        updated_at?: string
        user_id?: string
      }

      // Validate and format start_year to match YEAR_OPTIONS values
      const getStartYear = (): string => {
        if (!data?.start_year) return ""
        const yearValue = String(data.start_year).trim()
        // Check if the year exists in available options
        const isValidYear = YEAR_OPTIONS_VALUES.includes(yearValue)
        return isValidYear ? yearValue : ""
      }

      // Extract only form fields, excluding API metadata fields
      // Use optional chaining and nullish coalescing for safety
      const formFields: Partial<BusinessInformationFormValues> = {
        company_name: data?.company_name ?? "",
        start_year: getStartYear(),
        address: data?.address ?? "",
        postal_code: data?.postal_code ?? "",
        city: data?.city ?? "",
        state: data?.state ?? "",
        country: data?.country ?? "",
        vat_id: data?.vat_id ?? "",
        contact_name: data?.contact_name ?? "",
        contact_email: data?.contact_email ?? "",
        contact_number: data?.contact_number ?? "",
        whatsapp_number: data?.whatsapp_number ?? "",
        website: data?.website ?? "",
        facebook: data?.facebook ?? "",
        instagram: data?.instagram ?? "",
        x: data?.x ?? "",
        google_business_profile_link: data?.google_business_profile_link ?? "",
      }

      // Reset form with loaded data
      form.reset(formFields)
      setTimeout(() => {
        form.setValue("start_year", data.start_year)
      }, 0)
    }
  }, [businessInfoData, form])

  const onSubmit = async (values: BusinessInformationFormValues) => {
    await createBusinessInfo(values, {
      onSuccess: () => {
        toast.success("Business information saved!")
        router.push("/tasks/branding-content")
      },
    })
  }

  if (businessInfoLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center pt-4 bg-white rounded-lg border border-gray-300">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Section Header Component
  const SectionHeader = ({ icon: Icon, title }: { icon: typeof Building2; title: string }) => (
    <div className="col-span-2 flex items-center gap-2 pb-2 pt-4 first:pt-0">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div className="flex-1 h-px bg-border ml-2" />
    </div>
  )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          showFormErrors(errors)
        })}
        className="overflow-scroll"
      >
        <FormLayout
          className="grid-cols-2"
          footer={
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-primary text-white"
            >
              {isSubmitting ? "Saving..." : isEmpty ? "Update" : "Next"}
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          }
        >
          {/* Company Information Section */}
          <SectionHeader icon={Building2} title="Company Information" />

          <FormField
            control={form.control}
            name="company_name"
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
                    onSelectChange={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address Section */}
          <SectionHeader icon={MapPin} title="Address Information" />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormControl>
                  <CustomInput
                    label="Street Address"
                    id={field?.name}
                    type="text"
                    placeholder="123 Main St"
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

          {/* Contact Information Section */}
          <SectionHeader icon={Phone} title="Contact Information" />

          <FormField
            name="contact_name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CustomInput
                    label="Contact Name"
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
            name="contact_email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CustomInput
                    label="Contact Email"
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
                    label="Contact Number"
                    id={field?.name}
                    type="number"
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
                    label="WhatsApp Number"
                    id="whatsappNumber"
                    type="number"
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

          {/* Website & Social Media Section */}
          <SectionHeader icon={Globe} title="Website & Social Media" />
          {socialFields.map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormControl>
                    <CustomInput
                      id={fieldName}
                      type="text"
                      value={field.value?.replace(/^https?:\/\//, "") ?? ""}
                      required={fieldName === "website"}
                      onChange={(event) => {
                        field.onChange(normalizedUrl(event.target.value))
                      }}
                      label={fieldName.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
                      placeholder={`Enter ${fieldName
                        .replace(/_/g, " ")
                        .replace(/^\w/, (c) => c.toUpperCase())}`}
                      prefixText="https://"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </FormLayout>
      </form>
    </Form>
  )
}
