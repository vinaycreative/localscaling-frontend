"use client"

import type React from "react"
import OnboardingVideo from "@/components/reusable/onboarding-video"
import { TagInput } from "@/components/reusable/tags/tag-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Fragment, useEffect } from "react"
import { toast } from "sonner"
import { useAdsBudget, useCreateAdsBudget } from "@/hooks/use-ads-budget"

import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import FormLayout from "@/components/ui/form-layout"

export const locationBudgetSchema = z.object({
  budget: z.string().min(1, "Budget is required"),
  currency: z.string().min(1, "Currency is required"),
  locations: z.array(z.string()),
  services: z.array(z.string()),
})

export default function LocationsBudgetPage() {
  const router = useRouter()

  const { data: adsBudgetData, isLoading: adsBudgetLoading } = useAdsBudget()
  const { createAdsBudget, isPending: isSubmitting } = useCreateAdsBudget()

  const form = useForm<z.infer<typeof locationBudgetSchema>>({
    resolver: zodResolver(locationBudgetSchema),
    defaultValues: {
      budget: "",
      currency: "EUR",
      locations: [],
      services: [],
    },
  })

  const { setValue } = form

  // Load existing DB data
  useEffect(() => {
    if (adsBudgetData?.data) {
      const saved = adsBudgetData.data
      Object.entries(saved).forEach(([key, value]) => {
        setValue(key as any, value)
      })
    }
  }, [adsBudgetData, setValue])

  const handlePrev = () => {
    router.push("/tasks/tools-access")
  }

  const onSubmit = async (values: z.infer<typeof locationBudgetSchema>) => {
    try {
      await createAdsBudget(values)
      toast.success("Budget and locations saved successfully!")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Failed to save. Please try again.")
    }
  }

  if (adsBudgetLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <section className="w-full h-full grid lg:grid-cols-[auto_1fr] gap-4 overflow-hidden pt-4">
      <OnboardingVideo
        title="5. Locations & Budget"
        subTitle="Set your ads budget and its location."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-scroll">
          <FormLayout
            footer={
              <Fragment>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      Saving...
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    </>
                  ) : (
                    <>
                      Submit
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </Fragment>
            }
          >
            <Fragment>
              {/* BUDGET FIELD */}
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <Label>
                      Set monthly ads budget <span className="text-destructive">*</span>
                    </Label>

                    <div className="flex rounded border">
                      {/* Currency */}
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-0 border-r w-[100px] rounded-r-none">
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                <SelectItem value="EUR">€ (EUR)</SelectItem>
                                <SelectItem value="USD">$ (USD)</SelectItem>
                                <SelectItem value="GBP">£ (GBP)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      {/* Budget Input */}
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1000"
                          min="0"
                          className="rounded-l-none border-0 focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Locations */}
              <FormField
                control={form.control}
                name="locations"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TagInput
                        label="Most important locations for SEO"
                        placeholder="e.g., Berlin, London, New York"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Services */}
              <FormField
                control={form.control}
                name="services"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TagInput
                        label="Services provided"
                        placeholder="e.g., Web Design, Content Writing, PPC"
                        value={field.value}
                        onChange={field.onChange}
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
    </section>
  )
}
