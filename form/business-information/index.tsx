"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronRight, Loader2, Mail, CircleQuestionMark } from "lucide-react"
import { CustomInput } from "@/components/reusable/custom-input"
import { useBusinessInfo, useCreateBusinessInfo } from "@/hooks/useBusinessInfo"
import { normalizedUrl } from "@/lib/utils"
import FormLayout from "@/components/ui/form-layout"
import { businessInformationFormSchema } from "./schema"
import { BusinessInformationFormValues } from "./types"

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
      twitter: "",
      google_business_profile_link: "",
    },
  })

  useEffect(() => {
    const loadData = async () => {
      if (businessInfoData) {
        const data = businessInfoData as Partial<BusinessInformationFormValues>
        ;(Object.keys(data) as (keyof BusinessInformationFormValues)[]).forEach((key) => {
          const value = data[key]

          // avoid setting undefined values
          if (value !== undefined) {
            form.setValue(key, value)
            console.log("🚀 ~ loadData ~ key:", key, value)
          }
        })
      }
    }

    if (businessInfoData) {
      loadData()
    }
  }, [businessInfoData])

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
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin textcus-primary" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-scroll">
        <FormLayout
          className="grid-cols-2"
          footer={
            <Button type="submit" disabled={isSubmitting} className="rounded bg-primary text-white">
              {isSubmitting ? "Saving..." : isEmpty ? "Update" : "Next"}
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          }
        >
          {/* Company */}
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
                    onSelectChange={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Street Address */}
          <FormField
            control={form.control}
            name="address"
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
            name="contact_email"
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
                    label="Whatsapp number"
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

          {/* Website + Social Links */}
          {["website", "facebook", "instagram", "twitter", "google_business_profile_link"].map(
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
                        required={fieldName === "website"}
                        onChange={(event) => {
                          field.onChange(normalizedUrl(event.target.value))
                        }}
                        label={fieldName
                          .toLowerCase()
                          .replace(/_/g, " ")
                          .replace(/^\w/, (c) => c.toUpperCase())}
                        placeholder={`Enter ${fieldName
                          .toLowerCase()
                          .replace(/_/g, " ")
                          .replace(/^\w/, (c) => c.toUpperCase())}`}
                        prefixText={"http://"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          )}
        </FormLayout>
      </form>
    </Form>
  )
}
