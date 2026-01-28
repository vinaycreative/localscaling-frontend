import { AttachmentKind, EXT_MAP } from "./attachments.types"
import { FileText, File, Video, Music, ImageIcon, ExternalLink, ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react"
import Image from "next/image"

export function getExtFromUrl(url: string): string | undefined {
    try {
        const u = new URL(url)
        const pathname = u.pathname
        const last = pathname.split("/").pop() || ""
        const dot = last.lastIndexOf(".")
        if (dot === -1) return undefined
        const ext = last.slice(dot + 1).toLowerCase()
        return ext || undefined
    } catch {
        // if url isn't a valid URL, try a basic parse
        const clean = url.split("?")[0]
        const last = clean.split("/").pop() || ""
        const dot = last.lastIndexOf(".")
        if (dot === -1) return undefined
        const ext = last.slice(dot + 1).toLowerCase()
        return ext || undefined
    }
}

export function kindFromExt(ext?: string): AttachmentKind | undefined {
    if (!ext) return undefined
    return EXT_MAP[ext]
}

export function kindFromMime(mime?: string): AttachmentKind {
    if (!mime) return "unknown"
    const m = mime.toLowerCase()
    if (m.startsWith("image/")) return "image"
    if (m === "application/pdf") return "pdf"
    if (m.startsWith("video/")) return "video"
    if (m.startsWith("audio/")) return "audio"
    if (m.startsWith("text/")) return "text"
    if (
        m.includes("json") ||
        m.includes("xml") ||
        m.includes("csv") ||
        m.includes("markdown")
    )
        return "text"
    return "other"
}

/**
 * Best-effort HEAD to read Content-Type. May fail due to CORS.
 */
export async function headContentType(url: string, signal?: AbortSignal): Promise<string | undefined> {
    try {
        const res = await fetch(url, { method: "HEAD", signal })
        if (!res.ok) return undefined
        return res.headers.get("content-type") || undefined
    } catch {
        return undefined
    }
}

export function prettyFileName(url: string): string {
    try {
        const u = new URL(url)
        const last = u.pathname.split("/").pop()
        return decodeURIComponent(last || "attachment")
    } catch {
        const last = url.split("?")[0].split("/").pop()
        return last ? decodeURIComponent(last) : "attachment"
    }
}

export function KindIcon({ kind }: { kind: AttachmentKind }) {
    const cls = "h-4 w-4"
    switch (kind) {
        case "image":
            return <ImageIcon className={ cls } />
        case "pdf":
        case "text":
            return <FileText className={ cls } />
        case "video":
            return <Video className={ cls } />
        case "audio":
            return <Music className={ cls } />
        case "other":
        case "unknown":
        default:
            return <File className={ cls } />
    }
}