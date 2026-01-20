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
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge, BadgeTypes } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { FileText } from "lucide-react"

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

  const badgeVariant = (value: string) => {
    switch (value) {
      case "Open":
        return "secondary"
      case "In Progress":
        return "outline"
      case "Resolved":
        return "default"
      case "Closed":
        return "destructive"
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
      default:
        return "outline"
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] p-0">
          <DialogHeader className="px-6 pt-6">
            <div className="text-xs font-medium text-muted-foreground">
              {ticket?.created_by?.first_name}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
              <div className="text-muted-foreground shrink-0">#{ticket?.id}</div>

              {/* let this one actually truncate inside a flex container */}
              <div className="text-xl font-semibold tracking-tight w-full md:flex-1 md:text-left text-left">
                {ticket?.title || "Untitled ticket"}
              </div>
            </div>

            <DialogDescription className="sr-only">View and edit ticket</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <ScrollArea className="h-[400px] w-full">
                <div className="px-6 py-6 pt-0 space-y-5">
                  <div className="">
                    {/* Top facts row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
                      <div>
                        <div className="text-muted-foreground mb-1">Client</div>
                        <div className="font-medium">{ticket?.created_by?.first_name}</div>
                      </div>
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
                  <FormField
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
                  />

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
                      {ticket.attachments?.length ? (
                        ticket.attachments.map((f) => (
                          <Card
                            key={f.id}
                            className="flex items-center gap-3 px-3 py-2 border rounded-md"
                          >
                            <div className="h-8 w-8 rounded-md bg-red-100 text-red-600 flex items-center justify-center">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{f.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {Math.round(f.sizeKB)} KB
                              </p>
                            </div>
                            {f.url ? (
                              <a
                                href={f.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                View
                              </a>
                            ) : null}
                          </Card>
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
