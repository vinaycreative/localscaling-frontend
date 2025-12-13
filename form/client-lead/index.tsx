"use client"
import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { ChevronRight, Loader2, Mail, CircleQuestionMark } from "lucide-react"
import { CustomInput } from "@/components/reusable/custom-input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientsSchema } from "./schema"
import { Fragment } from "react"
import FormLayout from "@/components/ui/form-layout"
import { z } from "zod"
import { useCreateClientLead } from "@/hooks/useClientLead"

const COUNTRY_OPTIONS = [
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "IN", label: "India" },
  { value: "JP", label: "Japan" },
]

export const ClientLeadForm = () => {
  const { mutateAsync: createClientLead, isPending: isSubmitting } = useCreateClientLead()
  const form = useForm<z.infer<typeof createClientsSchema>>({
    resolver: zodResolver(createClientsSchema),
    defaultValues: {
      company_name: "",
      name: "",
      email: "",
      vat_id: "",
      address: "",
      postal_code: "",
      city: "",
      state: "",
      country: "",
      monthly_payment_excluding_taxes: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof createClientsSchema>) => {
    try {
      await createClientLead(values)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-scroll">
        <FormLayout
          className="grid-cols-2"
          footer={
            <Fragment>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded group bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Add lead"}
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
              </Button>
            </Fragment>
          }
        >
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormControl>
                  <CustomInput
                    label="Company name"
                    id={field.name}
                    type="text"
                    placeholder="Webbywolf Innovations"
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CustomInput
                    label="Client name"
                    id={field.name}
                    type="text"
                    placeholder="Olivia"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CustomInput
                    label="Client email"
                    id={field.name}
                    type="email"
                    placeholder="olivia@littlecloud.com"
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
            control={form.control}
            name="vat_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CustomInput
                    label="VAT ID"
                    id={field.name}
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

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CustomInput
                    label="Street address"
                    id={field.name}
                    type="text"
                    placeholder="123 Main Street"
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
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CustomInput
                    label="Postal code"
                    id={field.name}
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
                    id={field.name}
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
                    placeholder="Select state"
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
                    placeholder="Select country"
                    required={true}
                    value={field.value}
                    select={true}
                    selectOptions={COUNTRY_OPTIONS}
                    onSelectChange={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthly_payment_excluding_taxes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CustomInput
                    label="Monthly payment (Excluding taxes)"
                    id="monthlyPayment"
                    type="number"
                    placeholder="$5,000"
                    required={true}
                    value={field.value}
                    onChange={field.onChange}
                    className="col-span-2"
                    prefixText="$"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormLayout>
      </form>
    </Form>
  )
}
