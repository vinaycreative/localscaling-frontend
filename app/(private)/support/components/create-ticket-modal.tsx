// components/tickets/CreateTicketModal.tsx
import * as React from "react"
import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { Paperclip, UploadCloud, Info, Trash2, File as FileIcon } from "lucide-react"

// ✅ shadcn form primitives
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const TicketSchema = z.object({
  title: z.string().min(2, "Please enter a title"),
  category: z.string().min(1, "Select a category"),
  priority: z.enum(["low", "medium", "high"]),
  description: z.string().min(10, "Please add a little more detail"),
  files: z.custom<File[] | undefined>().optional(),
})
export type CreateTicketValues = z.infer<typeof TicketSchema>

type FileItem = {
  id: string
  file: File
  progress: number
  status: "pending" | "uploading" | "complete" | "error"
}

export type CreateTicketModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CreateTicketValues) => Promise<void> | void
  categories?: { label: string; value: string }[]
  priorities?: { label: string; value: "low" | "medium" | "high" }[]
  maxImageResolutionHint?: string
}

const LS_KEY_SKIP_CONFIRM = "create-ticket.skipConfirm"

export function CreateTicketModal({
  open,
  onOpenChange,
  onSubmit,
  categories = [
    { label: "Website, Ads etc", value: "website" },
    { label: "Billing", value: "billing" },
    { label: "Account", value: "account" },
    { label: "Other", value: "other" },
  ],
  priorities = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ],
  maxImageResolutionHint = "SVG, PNG, JPG or GIF (max. 800×400px)",
}: CreateTicketModalProps) {
  const [items, setItems] = useState<FileItem[]>([])
  const [submitting, setSubmitting] = useState(false)

  // confirmation state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [skipConfirm, setSkipConfirm] = useState(false)

  useEffect(() => {
    try {
      setSkipConfirm(localStorage.getItem(LS_KEY_SKIP_CONFIRM) === "1")
    } catch {}
  }, [])

  const form = useForm<CreateTicketValues>({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      title: "",
      description: "",
      category: categories[0]?.value ?? "",
      priority: "low",
    },
  })

  const simulateUpload = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: "uploading", progress: 10 } : it))
    )
    let p = 10
    const t = setInterval(() => {
      p += Math.ceil(Math.random() * 20)
      if (p >= 100) {
        clearInterval(t)
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, progress: 100, status: "complete" } : it))
        )
      } else {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, progress: p } : it)))
      }
    }, 300)
  }, [])

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return
    const next: FileItem[] = []
    Array.from(files).forEach((file) => {
      const id = `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`
      next.push({ id, file, progress: 0, status: "pending" })
      setTimeout(() => simulateUpload(id), 200)
    })
    setItems((prev) => [...prev, ...next])
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    addFiles(e.dataTransfer.files)
  }

  // 1) User presses submit → validate → show confirm (unless skipped)
  const requestSubmit = async (values: CreateTicketValues) => {
    if (skipConfirm) {
      return actuallySubmit(values)
    }
    setConfirmOpen(true)
  }

  // 2) Confirm dialog → proceed
  const actuallySubmit = async (values: CreateTicketValues) => {
    setSubmitting(true)
    try {
      if (dontShowAgain) {
        try {
          localStorage.setItem(LS_KEY_SKIP_CONFIRM, "1")
        } catch {}
        setSkipConfirm(true)
      }
      const payload: CreateTicketValues = { ...values, files: items.map((i) => i.file) }
      await onSubmit(payload)
      onOpenChange(false)
      setItems([])
      form.reset()
    } finally {
      setSubmitting(false)
      setConfirmOpen(false)
      setDontShowAgain(false)
    }
  }

  const removeFile = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!submitting) onOpenChange(v)
        }}
    
      >
        <DialogContent className="sm:max-w-[590px] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Create Ticket</DialogTitle>
            <DialogDescription>Tell us what’s going on so we can help quickly.</DialogDescription>
          </DialogHeader>


          {/* ⬇️ Use shadcn Form wrapper (functionality unchanged) */}
          <Form {...form} >
            <form className="px-6 pb-6 space-y-5" onSubmit={form.handleSubmit(requestSubmit)}>
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title of your ticket</FormLabel>
                    <FormControl>
                      <Input placeholder="What is your title?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category + Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(v) => field.onChange(v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
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
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(v: "low" | "medium" | "high") => field.onChange(v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Low, Medium, High" />
                          </SelectTrigger>
                          <SelectContent>
                            {priorities.map((p) => (
                              <SelectItem key={p.value} value={p.value}>
                                {p.label}
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

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>Please tell us about your issue</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            Be specific: what happened, where, expected vs actual, and steps to reproduce.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. I joined Stripe's Customer Success team to help them scale..."
                        className="min-h-[110px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Uploader (unchanged UI/behavior) */}
              <div className="space-y-3">
                <Label>Attachments</Label>
                <div
                  onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    addFiles(e.dataTransfer.files)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  className={cn(
                    "rounded-md border border-dashed p-5 relative bg-muted/30 hover:bg-muted/50 transition"
                  )}
                >
                  <input
                    type="file"
                    multiple
                    onChange={(e) => addFiles(e.target.files)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    aria-label="Upload files"
                  />
                  <div className="flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full border flex items-center justify-center">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Click to upload <span className="text-muted-foreground">or drag and drop</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{maxImageResolutionHint}</p>
                      </div>
                    </div>
                    <Paperclip className="h-10 w-10 opacity-70" />
                  </div>
                </div>

                {!!items.length && (
                  <ScrollArea className="max-h-48 pr-4">
                    <ul className="space-y-3 mt-1">
                      {items.map((item) => (
                        <li key={item.id} className="rounded-md border bg-background px-3 py-2">
                          <div className="flex items-center gap-3">
                            <FileIcon className="h-5 w-5 text-red-500 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium truncate">{item.file.name}</p>
                                <button
                                  type="button"
                                  onClick={() => removeFile(item.id)}
                                  className="text-muted-foreground hover:text-foreground"
                                  aria-label="Remove file"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                <span>{(item.file.size / 1024).toFixed(0)} KB</span>
                                <span
                                  className={cn(
                                    "font-medium",
                                    item.status === "complete" && "text-emerald-600"
                                  )}
                                >
                                  {item.status === "complete" ? "Complete" : `${item.progress}%`}
                                </span>
                              </div>
                              <Progress value={item.progress} className="mt-2" />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit ticket"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* CONFIRMATION MODAL (unchanged) */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="sm:max-w-[520px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm">Confirm ticket submission</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Please review details before submitting. Once submitted, you won’t be able to make
              changes.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex items-center gap-2">
            <Checkbox
              id="dont-show-again"
              checked={dontShowAgain}
              onCheckedChange={(v) => setDontShowAgain(!!v)}
            />
            <Label htmlFor="dont-show-again" className="text-xs text-muted-foreground">
              Don’t show again
            </Label>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="sm:mr-2">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={form.handleSubmit(actuallySubmit)}
              className="bg-primary text-primary-foreground"
            >
              Submit ticket
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
