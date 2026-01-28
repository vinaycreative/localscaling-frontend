import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { AttachmentResolved } from "./attachments.types"
import { KindIcon } from "./utils"

export function FullscreenPreview({ item }: { item: AttachmentResolved }) {
    // Images: full containment
    if (item.kind === "image") {
        return (
            <div className="relative h-full w-full">
                {/* For images: show centered and contained */}
                <Image
                    src={item.url}
                    alt={item.name ?? "attachment"}
                    fill
                    className="object-contain"
                    sizes="100vw"
                />
            </div>
        )
    }

    // PDF: iframe (works for public URLs)
    if (item.kind === "pdf") {
        return (
            <iframe
                title={item.name ?? "PDF preview"}
                src={item.url}
                className="h-full w-full"
            />
        )
    }

    // Video
    if (item.kind === "video") {
        return (
            <video src={item.url} controls className="w-full h-full">
                Your browser does not support video playback.
            </video>
        )
    }

    // Audio
    if (item.kind === "audio") {
        return (
            <div className="flex h-full w-full items-center justify-center p-6">
                <audio src={item.url} controls className="w-full max-w-xl" />
            </div>
        )
    }

    // Text: try iframe (works if server serves text with CORS; otherwise user can open)
    if (item.kind === "text") {
        return (
            <iframe
                title={item.name ?? "Text preview"}
                src={item.url}
                className="h-full w-full"
            />
        )
    }

    // Other / Unknown: fallback
    return (
        <div className="flex h-full w-full items-center justify-center p-6">
            <div className="max-w-md rounded-xl border bg-card p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border">
                    <KindIcon kind={item.kind} />
                </div>
                <p className="text-sm font-medium">{item.name ?? "Attachment"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                    Preview isn’t available for this type. Use “Open” to view it in a new tab.
                </p>
                <div className="mt-4">
                    <Button asChild>
                        <a href={item.url} target="_blank" rel="noreferrer">
                            Open in new tab <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    )
}
