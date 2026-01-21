"use client"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { CreateTicketModal } from "./components/create-ticket-modal"
import { SupportTable } from "./components/support-table"
import Page from "@/components/base/Page"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTicketSchema } from "@/types/schema/support"
import { CreateTicketValues } from "@/types/support"
import { useCreateTicket } from "@/hooks/useTickets"
import { toast } from "sonner"
import { useLoggedInUser } from "@/hooks/useAuth"
import { uploadFileToStorage } from "@/lib/storage"
import { Role } from "@/constants/auth"

export default function SupportPage() {
  const { user } = useLoggedInUser()
  const isUser = user?.role === Role.client
  const [createTicket, setCreateTicket] = useState<boolean>(false)
  const form = useForm<CreateTicketValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Website",
      priority: "low",
    },
  })

  const { createTicket: createTicketForm } = useCreateTicket()
  const [files, setFiles] = React.useState<File[]>(form?.getValues("files") || [])

  return (
    <Page
      rightButton={
        isUser && <Button
          onClick={() => {
            setCreateTicket((prev) => !prev)
          }}
          className="text-xs md:text-sm"
        >
          Create a new ticket
        </Button>
      }
      navURL="Support"
      title="Support"
      description="Create and track your support requests."
    >
      <div className="overflow-scroll">
        <div className="py-0">
          <SupportTable />
        </div>
      </div>
      {createTicket && isUser && (
        <CreateTicketModal
          form={form}
          open={createTicket}
          onOpenChange={(val) => {
            setFiles([])
            form.setValue("files", [])
            form.reset()
            setCreateTicket(val)
          }}
          onSubmit={async (values: CreateTicketValues) => {
            try {
              const attachments: File[] = files ?? []
              let attachmentsUrls: string[] = []

              if (attachments && attachments.length > 0) {
                const uploadPromises = attachments.map((file: File) =>
                  uploadFileToStorage(file, file.name, user?.id ?? "")
                )
                attachmentsUrls = await Promise.all(uploadPromises)
              }
              const payload = { ...values, files: attachmentsUrls }

              const res = await createTicketForm(payload)
              if (!res.success) return
              toast.success(res.message)
              setCreateTicket(false)
              setFiles([])
              form.setValue("files", [])
              form.reset()
            } catch (error) {
              toast.error("Error")
            }
          }}
          files={files}
          setFiles={setFiles}
        />
      )}
    </Page>
  )
}
