export type AttachmentKind = "image" | "pdf" | "video" | "audio" | "text" | "other" | "unknown"

export type AttachmentResolved = {
    url: string
    kind: AttachmentKind
    mime?: string
    ext?: string
    name?: string
}

export type AttachmentGalleryProps = {
    urls: string[]
    className?: string
    thumbSize?: number
    // Optional: if you already know a name for each URL, you can pass a function
    getName?: (url: string) => string | undefined
}

export const EXT_MAP: Record<string, AttachmentKind> = {
    jpg: "image",
    jpeg: "image",
    png: "image",
    gif: "image",
    webp: "image",
    svg: "image",

    pdf: "pdf",

    mp4: "video",
    webm: "video",
    mov: "video",
    m4v: "video",

    mp3: "audio",
    wav: "audio",
    ogg: "audio",
    m4a: "audio",

    txt: "text",
    md: "text",
    json: "text",
    csv: "text",
}
