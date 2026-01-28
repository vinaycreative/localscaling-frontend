"use client"

import * as React from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { VirtuosoMasonry } from '@virtuoso.dev/masonry'
import {
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Eye,
} from "lucide-react"
import { useVideoThumbnail } from "./use-thumbnail-video"
import { AttachmentGalleryProps, AttachmentResolved } from "./attachments.types"
import {
  getExtFromUrl,
  kindFromExt,
  prettyFileName,
  headContentType,
  kindFromMime,
  KindIcon,
} from "./utils"
import { FullscreenPreview } from "./fullscreen-preview"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export function AttachmentGallery({
  urls,
  className,
  thumbSize = 200,
  getName,
}: AttachmentGalleryProps) {
  const [items, setItems] = React.useState<AttachmentResolved[]>(() =>
    urls.map((url) => {
      const ext = getExtFromUrl(url)
      const fromExt = kindFromExt(ext)
      return {
        url,
        ext,
        kind: fromExt ?? "unknown",
        name: getName?.(url) ?? prettyFileName(url),
      }
    }),
  )

  const cacheRef = React.useRef<Map<string, AttachmentResolved>>(new Map())


  const [open, setOpen] = React.useState(false)
  const [active, setActive] = React.useState<AttachmentResolved | null>(null)
  const isMobile = useIsMobile() ?? false

  // const items = React.useMemo(() => resolvedItems, [resolvedItems])
  // resolvedItems = your attachments array after type detection

  const activeIndex = React.useMemo(() => {
    if (!active?.url) return -1
    return items.findIndex((x) => x.url === active.url)
  }, [active?.url, items])

  const hasPrev = activeIndex > 0
  const hasNext = activeIndex >= 0 && activeIndex < items.length - 1

  const goPrev = () => {
    if (activeIndex <= 0) return
    setActive(items[activeIndex - 1])
  }

  const goNext = () => {
    if (activeIndex === -1 || activeIndex >= items.length - 1) return
    setActive(items[activeIndex + 1])
  }

  const closePreview = () => {
    setOpen(false)
  }

  // Resolve unknowns via HEAD (best-effort)
  React.useEffect(() => {
    let mounted = true
    const ac = new AbortController()

    async function resolve() {
      const next = await Promise.all(
        items.map(async (it) => {
          if (it.kind !== "unknown") return it

          const cached = cacheRef.current.get(it.url)
          if (cached) return cached

          const mime = await headContentType(it.url, ac.signal)
          const kind = kindFromMime(mime)

          const resolved: AttachmentResolved = { ...it, mime, kind }
          cacheRef.current.set(it.url, resolved)
          return resolved
        }),
      )

      if (mounted) setItems(next)
    }

    resolve()

    return () => {
      mounted = false
      ac.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls.join("|")])

  React.useEffect(() => {
    // keep state in sync if urls change
    setItems(
      urls.map((url) => {
        const ext = getExtFromUrl(url)
        const fromExt = kindFromExt(ext)
        return {
          url,
          ext,
          kind: fromExt ?? cacheRef.current.get(url)?.kind ?? "unknown",
          mime: cacheRef.current.get(url)?.mime,
          name: getName?.(url) ?? prettyFileName(url),
        }
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls])

  if (!urls?.length) {
    return <p className="text-xs text-muted-foreground">No attachments</p>
  }

  const onPreview = (it: AttachmentResolved) => {
    setActive(it)
    setOpen(true)
  }


  const ItemContent: React.FC<{ data: AttachmentResolved, index: number }> = ({ data, index }) => {

    return (
      <AttachmentCard
        index={index}
        key={data?.url}
        item={data}
        thumbSize={thumbSize}
        onPreview={() => onPreview(data)}
      />
    )
  }



  return (
    <>
      <VirtuosoMasonry
        columnCount={isMobile ? 1 : 3}
        data={items}
        style={{ height: 500 }}
        initialItemCount={50}
        ItemContent={ItemContent}
        className={cn("gap-3 space-y-4 sm:grid-cols-1" , className)}
        cellSpacing={10}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-w-[100vw] w-[100vw] h-[100vh] sm:max-w-[100vw] overflow-hidden">
          <DialogTitle className="sr-only">Attachment preview</DialogTitle>

          {/* Layout wrapper */}
          <div className="flex h-full w-full flex-col bg-background">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{active?.name ?? "Attachment"}</p>
                <p className="text-xs text-muted-foreground">
                  {active?.mime ? active.mime : active?.ext ? `.${active.ext}` : "Unknown type"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {active?.url ? (
                  <Button asChild variant="outline" size="sm" type="button">
                    <a href={active.url} target="_blank" rel="noreferrer">
                      Open <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>

            {/* Body (fills remaining space) */}
            {/* <div className="flex-1 min-h-0"> */}
            <div className="h-[80dvh] w-full">
              {active ? <FullscreenPreview item={active} /> : null}
            </div>
            {/* </div> */}

            {/* Footer */}
            <DialogFooter>
              <div className="flex items-center justify-between gap-2 p-3 px-4">
                <div className="text-xs text-muted-foreground">
                  {activeIndex >= 0 ? `${activeIndex + 1} / ${items.length}` : ""}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!hasPrev}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      goPrev()
                    }}
                  >
                    <ChevronLeft />
                    Previous
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!hasNext}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      goNext()
                    }}
                  >
                    Next <ChevronRight />
                  </Button>

                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      closePreview()
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function AttachmentCard({
  item,
  thumbSize,
  onPreview,
  index
}: {
  index: number,
  item: AttachmentResolved
  thumbSize: number
  onPreview: () => void
}) {
  const height = index % 10 === 0 ? 300 : index % 5 === 0 ? 280 : index % 7 ? 250 : 220
  return (
    <div style={{ height }} className="group relative overflow-hidden rounded-lg border bg-card w-full my-2">
      {/* Hover overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20" />
      <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          className="pointer-events-auto"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onPreview()
          }}
        >
          Preview <Eye className="h-4 w-4" />
        </Button>
      </div>

      {/* Body */}
      <div className="p-2">
        {item?.kind === "image" ? (
          <div className="relative overflow-hidden rounded-md h-full w-full" style={{ height: height - 20 }}>
            {/* Note: next/image needs the domain allowed in next.config */}
            <Image
              src={item?.url}
              alt={item?.name ?? "attachment"}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover w-full h-full"
            />
          </div>
        ) : item?.kind === "video" ? (
          <VideoThumb url={item.url} name={item.name} height={height - 20} />
        ) : (
          <div
            className="flex items-center gap-3 rounded-md bg-background px-3 py-3 w-full"
          // style={{ width: thumbSize }}
          >
            <div className="flex h-9 items-center justify-center rounded-md">
              <KindIcon kind={item?.kind} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium break-words">{item?.name ?? "attachment"}</p>
              <p className="text-xs text-muted-foreground">
                {item?.kind === "unknown" ? "Unknown type" : item?.kind?.toUpperCase()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function VideoThumb({ url, name, height }: { url: string; name?: string, height: number }) {
  const { thumb, loading } = useVideoThumbnail(url, true)

  return (
    <div
      className="relative overflow-hidden rounded-md border bg-muted"
      style={{ width: "100%", height }}
    >
      {thumb ? (
        <Image src={thumb} alt={name ?? "video"} fill className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
          {loading ? "Generating..." : "Video"}
        </div>
      )}
    </div>
  )
}
