import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import OnboardingVideo from "@/components/reusable/onboarding-video"
import { ChevronRight, Loader2, Mail, CircleQuestionMark } from "lucide-react"
import { CustomInput } from "@/components/reusable/custom-input"
import { useBusinessInfo, useCreateBusinessInfo } from "@/hooks/use-business-info"
import { normalizedUrl } from "@/lib/utils"
import FormLayout from "@/components/ui/form-layout"
import { useRouter } from "next/navigation"
import { businessInformationFormSchema } from "./schemas"
import { z } from "zod"
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

export const businessInformationForm = () => {
  const router = useRouter()

  const { data: businessInfoData, isLoading: businessInfoLoading } = useBusinessInfo()

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

  const onSubmit = async (values: any) => {
    try {
      // await createBusinessInfo(values as any)
      toast.success("Business information saved!")
      router.push("/tasks/branding-content")
    } catch (error) {
      toast.error("Failed to save. Please try again.")
    } finally {
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-scroll">
        <FormLayout
          className="grid-cols-2"
          footer={
            <Button type="submit" disabled={false} className="rounded bg-primary text-white">
              {false ? "Saving..." : "Next"}
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          }
        >
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
        </FormLayout>
      </form>
    </Form>
  )
}
