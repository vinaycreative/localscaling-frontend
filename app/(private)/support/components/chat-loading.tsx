"use client"

import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function MessageBubbleSkeleton({
  side = "left",
}: {
  side?: "left" | "right"
  withAttachment?: boolean
}) {
  const isRight = side === "right"

  return (
    <div className={cn("flex w-full", isRight ? "justify-end" : "justify-start")}>
      <div className="w-[70%]">
        {/* name + timestamp row */}
        <div
          className={cn(
            "mb-1 flex items-center gap-2 text-xs text-muted-foreground",
            isRight ? "justify-between pr-2" : "justify-between pl-2"
          )}
        >
          {!isRight && <Skeleton className="h-3 w-10" />}
          <Skeleton className="h-3 w-28" />
          {isRight && <Skeleton className="h-3 w-10" />}
        </div>

        {/* bubble */}
        <div
          className={cn(
            "rounded-xl border px-4 py-3",
            isRight ? "rounded-tr-md" : "rounded-tl-md bg-muted/50"
          )}
        >
          <Skeleton className="mb-2 h-3.5 w-[85%]" />
          <Skeleton className="mb-2 h-3.5 w-[70%]" />
        </div>
      </div>
    </div>
  )
}

function ThreadSkeleton() {
  return (
    <main className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto p-6">
        <Skeleton className="mx-auto mb-5 h-3 w-24 rounded-full" />
        <div className="space-y-2">
          <MessageBubbleSkeleton side="left" />
          <MessageBubbleSkeleton side="right" />
          <MessageBubbleSkeleton side="left" />
          <MessageBubbleSkeleton side="right" />
        </div>

        {/* message composer */}
        <div className="sticky border -bottom-4 mt-3 bg-background/80 p-0 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="rounded-xl border p-3">
            <Skeleton className="mb-3 h-16 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </main>
  )
}

function RightPanelSkeleton() {
  return (
    <aside className="hidden w-80 shrink-0 border-l bg-background p-4 lg:block">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-muted" />
        <div className="flex-1">
          <Skeleton className="mb-2 h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      <Skeleton className="mb-3 h-9 w-full rounded-lg" />

      <div className="mt-6">
        <Skeleton className="mb-2 h-3 w-28" />
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-muted" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </aside>
  )
}

export default function ChatLoading() {
  return (
    <div className="flex h-[90vh]">
      <ThreadSkeleton />
      <RightPanelSkeleton />
    </div>
  )
}
