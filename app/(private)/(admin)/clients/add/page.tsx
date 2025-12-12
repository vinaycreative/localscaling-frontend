"use client"

import type React from "react"

import Page from "@/components/base/Page"
import { CustomInput } from "@/components/reusable/custom-input"
import { Button } from "@/components/ui/button"
import { ChevronRight, FileQuestion as CircleQuestionMark, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { Fragment, useState } from "react"
import z, { file } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { ClientsFormData } from "@/interfaces/onboarding/clients"
import { useCreateNewClients, useGetClients } from "@/hooks/use-clients"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import FormLayout from "@/components/ui/form-layout"

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

const STATE_OPTIONS = [
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
  { value: "IL", label: "Illinois" },
  { value: "PA", label: "Pennsylvania" },
  { value: "OH", label: "Ohio" },
  { value: "GA", label: "Georgia" },
]

export const createClientsSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  client_name: z
    .string()
    .min(1, "Client name is required")
    .max(100, "Client name must be less than 100 characters"),
  client_email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  vat_id: z.string().min(1, "VAT ID is required"),
  street_address: z.string().min(1, "Street address is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required").max(50, "State must be less than 50 characters"),
  country: z
    .string()
    .min(1, "Country is required")
    .max(50, "Country must be less than 50 characters"),
  monthly_payment: z
    .string()
    .min(1, "Monthly payment is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount (e.g., 1000 or 1000.50)")
    .transform((val) => parseFloat(val).toFixed(2)),
})

function AddClientPage() {
  const router = useRouter()
  const { data: clientsData, isLoading: clientsLoading, error: clientsError } = useGetClients()

  const {
    createNewClients,
    isPending: isSubmitting,
    error: createNewClientsError,
  } = useCreateNewClients()

  const form = useForm<z.infer<typeof createClientsSchema>>({
    resolver: zodResolver(createClientsSchema),
    defaultValues: {
      company_name: "",
      client_name: "",
      client_email: "",
      vat_id: "",
      street_address: "",
      postal_code: "",
      city: "",
      state: "",
      country: "",
      monthly_payment: "",
    },
  })

  const handleBack = (): void => {
    router.back()
  }

  const onSubmit = async (values: ClientsFormData) => {
    try {
      const payload: ClientsFormData = {
        ...values,
      }
      await createNewClients(values)
      toast.success("Website setup saved successfully!")
      // handleNext()
    } catch (error) {
      toast.error("Failed to save changes.")
    } finally {
    }
  }

  return (
    <Page
      navURL="clients"
      title="Add New Client"
      description="Enter client details and billing information"
    >
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
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      label="Company name"
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
              name="client_email"
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
              name="street_address"
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
              name="monthly_payment"
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
    </Page>
  )
}

export default AddClientPage
