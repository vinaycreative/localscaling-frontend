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
  // description: z.string().optional(),
  // assigneeId: z.string().min(1, "Please select assignee"),
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
    // defaultValues: { description: ticket.description },
  })

  // keep form in sync when ticket prop changes
  useEffect(() => {
    // form.reset({ desc  ription: ticket.description })
  }, [ticket, form])

  const handleSubmit = async (values: z.infer<typeof Schema>) => {
    // const updated: Ticket = {
    //   ...ticket,
    //   description: values.description ?? "",
    // }
    // await onSubmit(updated)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[60dvw] p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogDescription className="text-md text-accent-foreground">
              View Ticket Details
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
                        <Badge variant="outline" className="">{ticket.assigned_to?.first_name ?? "N/A"}</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm leading-none font-medium mb-1.5">Description</div>
                    <p className="text-foreground text-xs">{ticket.description}</p>
                  </div>

                  <div className="space-y-2">
                    <FormLabel className="text-xs">Attachments</FormLabel>

                    <div className="grid grid-cols-3 gap-2 space-y-2">
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
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="p-6 pb-6 pt-3">
                <div className="flex justify-end">
                  <Button type="submit" className="w-full sm:w-auto">
                    Close
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
