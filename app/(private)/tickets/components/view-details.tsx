// components/tickets/TicketDetailsModal.tsx
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
import { Badge, BadgeTypes } from "@/components/ui/badge"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

// ✅ shadcn form primitives
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Ticket, UpdateTicketPayload } from "@/types/support"
import Image from "next/image"
import { PRIORITIES, PRIORITIES_TYPE, STATUS, STATUS_TYPE } from "@/constants/select-options"
import { SimpleSelect } from "@/components/ui/react-select"
import { OptionObj } from "@/components/ui/react-select/types"
import { Loader2 } from "lucide-react"
import { AttachmentGallery } from "@/components/ui/attachment-gallery/attachment-gallery"

export type TicketDetailsModalProps = {
  isLoading: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  ticket: Ticket
  assignees?: { value: string; label: string }[]
  onSubmit: (updated: UpdateTicketPayload) => Promise<void> | void
}

// ---------- Form Schema ----------
const Schema = z.object({
  description: z.string().optional(),
  assigned_to: z.string().min(1, "Please select assignee"),
  status: z.string().min(1, "Please select status"),
  priority: z.string().min(1, "Please select priority"),
})

// ---------- Component ----------
export function TicketDetailsModal({
  open,
  onOpenChange,
  ticket,
  assignees,
  onSubmit,
  isLoading,
}: TicketDetailsModalProps) {
  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {
      description: ticket.description,
      assigned_to: ticket.assigned_to?.id,
      status: ticket.status,
      priority: ticket.priority,
    },
  })

  // keep form in sync when ticket prop changes
  useEffect(() => {
    form.reset({
      description: ticket.description ?? "",
      assigned_to: ticket.assigned_to?.id ?? "",
      status: ticket.status ?? "",
      priority: ticket.priority ?? "",
    })
  }, [ticket, form])

  const handleSubmit = async (values: z.infer<typeof Schema>) => {
    console.log("🚀 ~ handleSubmit ~ values: INNSSIIEEDDEE", values)
    const updated: UpdateTicketPayload = {
      ...ticket,
      assigned_to: values?.assigned_to,
      created_by: ticket?.created_by?.id,
      status: values?.status as STATUS_TYPE,
      priority: values?.priority as PRIORITIES_TYPE,
    }
    await onSubmit(updated)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[80dvw] p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogDescription className="text-md text-accent-foreground">
              View and edit ticket
            </DialogDescription>
            <div className="text-sm font-medium text-muted-foreground">
              {ticket?.created_by?.first_name} {ticket?.created_by?.last_name}
              {/* <div className="text-muted-foreground shrink-0">#{ticket?.id}</div> */}
            </div>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <ScrollArea className="h-[400px] w-full">
                <div className="px-6 py-6 pt-0 space-y-5">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
                    {/* let this one actually truncate inside a flex container */}
                    <div className="text-xl font-semibold tracking-tight w-full md:flex-1 md:text-left text-left">
                      {ticket?.title || "Untitled ticket"}
                    </div>
                  </div>
                  <div className="">
                    {/* Top facts row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
                      <div>
                        <div className="text-muted-foreground mb-1">Category</div>
                        <Badge variant="outline" className="">
                          {ticket.category}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Status</div>
                        <Badge className="capitalize" variant={ticket?.status as BadgeTypes}>
                          {ticket?.status.replaceAll("_", " ")}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Priority</div>
                        <Badge className="capitalize" variant={ticket?.priority as BadgeTypes}>
                          {ticket?.priority.replaceAll("_", " ")}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Assigned to</div>
                        <Badge variant="outline" className="">
                          {ticket.assigned_to?.email ?? "N/A"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm leading-none font-medium mb-1.5">Description</div>
                    <p className="text-foreground text-xs">{ticket.description}</p>
                  </div>
                  {/* <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[110px] resize-y"
                            placeholder="Info about the project"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="assigned_to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Assigned to</FormLabel>
                          <FormControl>
                            <SimpleSelect
                              value={
                                field.value
                                  ? {
                                      label:
                                        assignees?.find((a) => a.value === field.value)?.label ??
                                        "",
                                      value: field.value,
                                    }
                                  : null
                              }
                              className={"!w-full"}
                              isMulti={false}
                              isClearable={false}
                              placeholder="Select Assignee."
                              options={assignees?.map((a) => ({ label: a.label, value: a.value }))}
                              onChange={(newValue) => {
                                const selectedOption = newValue as OptionObj | null
                                console.log(
                                  "🚀 ~ TicketDetailsModal ~ selectedOption:",
                                  selectedOption
                                )
                                field.onChange(selectedOption?.value)
                              }}
                            />
                            {/* <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-full max-w-full truncate ">
                                <SelectValue
                                  placeholder="Select assignee"
                                  className="max-w-[100px] "
                                />
                              </SelectTrigger>
                              <SelectContent className="w-full">
                                {assignees?.map((a) => (
                                  <SelectItem key={a.label} value={a.value}>
                                    {a.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Status</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-full max-w-full truncate ">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS?.map((a) => (
                                  <SelectItem key={a.label} value={a.value}>
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

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Priority</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-full max-w-full truncate ">
                                <SelectValue placeholder="Select Priority" />
                              </SelectTrigger>
                              <SelectContent>
                                {PRIORITIES?.map((a) => (
                                  <SelectItem key={a.label} value={a.value}>
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
                  </div>

                  <div className="space-y-2">
                    <FormLabel className="text-xs">Attachments</FormLabel>

 <AttachmentGallery urls={ticket?.files ?? []} />
                    {/* <div className="grid grid-cols-3 gap-2 space-y-2">
                      {ticket?.files?.length ? (
                        ticket?.files.map((f) => {
                          const isImageUrl = (url: string) => {
                            return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
                          }
                          return isImageUrl(f) && f.startsWith("https") ? (
                            <Image src={f} key={f} alt="attachment" width={200} height={200} />
                          ) : null
                        })
                      ) : (
                        <p className="text-xs text-muted-foreground">No attachments</p>
                      )}
                    </div> */}
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="p-6 pb-6 pt-3">
                <div className="flex justify-end">
                  <Button disabled={isLoading} type="submit" className="w-full sm:w-auto">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2" />
                        <span className="text-xs">Updating...</span>
                      </>
                    ) : (
                      "Update Ticket"
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
