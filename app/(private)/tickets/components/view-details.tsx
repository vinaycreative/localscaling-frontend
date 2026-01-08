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
import { Badge, BadgeTypes, PriorityBadge, StatusBadge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import { Ticket } from "@/types/support"
import Image from "next/image"

export type TicketDetailsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticket: Ticket
  assignees?: { id: string; label: string }[]
  onSubmit: (updated: Ticket) => Promise<void> | void
}

// ---------- Form Schema ----------
const Schema = z.object({
  description: z.string().optional(),
  assigneeId: z.string().min(1, "Please select assignee"),
})

// ---------- Component ----------
export function TicketDetailsModal({
  open,
  onOpenChange,
  ticket,
  assignees = [{ id: "default", label: "Default User" }],
  onSubmit,
}: TicketDetailsModalProps) {
  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: { description: ticket.description },
  })

  // keep form in sync when ticket prop changes
  useEffect(() => {
    form.reset({ description: ticket.description })
  }, [ticket, form])

  const handleSubmit = async (values: z.infer<typeof Schema>) => {
    const updated: Ticket = {
      ...ticket,
      description: values.description ?? "",
    }
    await onSubmit(updated)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] p-0">
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
                      {/* <div>
                        <div className="text-muted-foreground mb-1">Client</div>
                        <div className="font-medium">{ticket.created_by?.first_name}</div>
                      </div> */}
                      <div>
                        <div className="text-muted-foreground mb-1">Category</div>
                        <Badge variant="outline" className="text-[11px]">
                          {ticket.category}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Status</div>
                        <Badge className="capitalize" variant={ticket?.status as BadgeTypes}>
                          {ticket?.status}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Priority</div>
                        <Badge className="capitalize" variant={ticket?.priority as BadgeTypes}>
                          {ticket?.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Description</div>
                    <p>{ticket.description}</p>
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

                  <FormField
                    control={form.control}
                    name="assigneeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Assigned to</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent>
                              {assignees.map((a) => (
                                <SelectItem key={a.id} value={a.id}>
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

                  <div className="space-y-2">
                    <FormLabel className="text-xs">Attachments</FormLabel>

                    <div className="space-y-2">
                      {ticket?.files?.length ? (
                        ticket?.files.map((f) => (
                          <Image src={f} key={f} alt={f} width={100} height={100} />
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">No attachments</p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="p-6 pb-6 pt-3">
                <div className="flex justify-end">
                  <Button type="submit" className="w-full sm:w-auto">
                    Done
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
