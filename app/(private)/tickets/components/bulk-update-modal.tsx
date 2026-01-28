"use client"

import * as React from "react"
import { useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { BulkUpdateTicketsPayload } from "@/types/support"
import { PRIORITIES, PRIORITIES_TYPE, STATUS, STATUS_TYPE } from "@/constants/select-options"
import { SimpleSelect } from "@/components/ui/react-select"
import { OptionObj } from "@/components/ui/react-select/types"
import { Loader2 } from "lucide-react"

// ✅ ids required, others optional
const Schema = z.object({
  ids: z.array(z.string()).min(1, "Please select at least one ticket"),
  assigned_to: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
})

type FormValues = z.infer<typeof Schema>

export type BulkUpdateModalProps = {
  isLoading: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  ticket: Pick<BulkUpdateTicketsPayload, "ids"> // only ids required from parent
  assignees?: { value: string; label: string }[]
  onSubmit: (updated: BulkUpdateTicketsPayload) => Promise<void> | void
  children?: React.ReactNode
}

export function BulkUpdateModal({
  open,
  onOpenChange,
  ticket,
  assignees,
  onSubmit,
  isLoading,
  children,
}: BulkUpdateModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      ids: ticket?.ids ?? [],
      assigned_to: undefined,
      status: undefined,
      priority: undefined,
    },
  })

  // keep form in sync when ids change
  // useEffect(() => {
  //   form.reset({
  //     ids: ticket?.ids ?? [],
  //     assigned_to: undefined,
  //     status: undefined,
  //     priority: undefined,
  //   })
  // }, [ticket?.ids, form])

  const handleSubmit = async (values: FormValues) => {

    // ✅ build payload with only meaningful updates
    const payload: BulkUpdateTicketsPayload = {
      ids: values.ids,
      ...(values.assigned_to ? { assigned_to: values.assigned_to } : {}),
      ...(values.status ? { status: values.status as STATUS_TYPE } : {}),
      ...(values.priority ? { priority: values.priority as PRIORITIES_TYPE } : {}),
    }

    // ✅ optional: prevent submitting if nothing to update
    const hasUpdates =
      "assigned_to" in payload || "status" in payload || "priority" in payload
    if (!hasUpdates) {
      form.setError("assigned_to", { message: "Select at least one field to update" })
      return
    }

    await onSubmit(payload)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isLoading && onOpenChange(next)} >
      <DialogContent
        className="max-w-[98dvw] sm:max-w-[100dvw] p-0 h-[100dvh] sm:h-[100vh]"
        onEscapeKeyDown={(e) => {
          if (isLoading) e.preventDefault()
        }}
        onInteractOutside={(e) => {
          if (isLoading) e.preventDefault()
        }}
      >
        <DialogHeader className="px-6 pt-6">
          <DialogDescription className="text-md text-accent-foreground">
            Bulk update tickets ({ticket?.ids?.length ?? 0} selected)
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ScrollArea className="h-[80dvh] w-full">
              <div className="px-6 py-0 pt-0 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {form?.formState?.errors?.ids && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <FormMessage>{form?.formState?.errors?.ids?.message}</FormMessage>
                    </div>
                  )}
                  {/* Assigned To (optional) */}
                  <FormField
                    control={form.control}
                    name="assigned_to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Assigned to (optional)</FormLabel>
                        <FormControl>
                          <SimpleSelect
                            value={
                              field.value
                                ? {
                                  label:
                                    assignees?.find((a) => a.value === field.value)?.label ?? "",
                                  value: field.value,
                                }
                                : null
                            }
                            className="w-full"
                            isMulti={false}
                            isClearable
                            placeholder="Select assignee"
                            options={assignees?.map((a) => ({ label: a.label, value: a.value })) ?? []}
                            onChange={(newValue) => {
                              const selected = newValue as OptionObj | null
                              field.onChange(selected?.value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Status (optional) */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Status (optional)</FormLabel>
                        <FormControl>
                          <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v || undefined)}>
                            <SelectTrigger className="w-full max-w-full truncate">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS.map((a) => (
                                <SelectItem key={a.value} value={a.value}>
                                  {a.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Priority (optional) */}
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Priority (optional)</FormLabel>
                        <FormControl>
                          <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v || undefined)}>
                            <SelectTrigger className="w-full max-w-full truncate">
                              <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              {PRIORITIES.map((a) => (
                                <SelectItem key={a.value} value={a.value}>
                                  {a.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {children && (
                    <div className="col-span-2 sm:col-span-2 lg:col-span-3">
                      {children}
                    </div>
                  )}
                </div>

              </div>
            </ScrollArea>
            {/* Children section (scrollable + contained) */}


            <DialogFooter className="p-6 pb-6 pt-3">
              <div className="flex justify-end">
                <Button disabled={isLoading || form?.formState?.isSubmitting} type="submit" className="w-full sm:w-auto">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span className="text-xs">Updating...</span>
                    </>
                  ) : (
                    "Bulk Update Tickets"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
