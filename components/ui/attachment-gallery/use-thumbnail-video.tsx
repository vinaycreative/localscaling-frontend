// hooks/useVideoThumbnail.ts
"use client"

import * as React from "react"
// utils/videoThumbnail.ts
export async function generateVideoThumbnail(
    url: string,
    opts?: {
        captureTime?: number | "auto" // seconds, or "auto"
        width?: number               // output width (keeps aspect ratio)
        mimeType?: "image/jpeg" | "image/png" | "image/webp"
        quality?: number             // 0..1 for jpeg/webp
        timeoutMs?: number
    }
): Promise<string> {
    const {
        captureTime = "auto",
        width = 480,
        mimeType = "image/jpeg",
        quality = 0.82,
        timeoutMs = 12000,
    } = opts ?? {}

    return new Promise((resolve, reject) => {
        const video = document.createElement("video")
        video.crossOrigin = "anonymous" // requires server CORS headers
        video.preload = "metadata"
        video.muted = true
        video.playsInline = true

        const cleanup = () => {
            video.pause()
            video.removeAttribute("src")
            video.load()
        }

        const timeout = window.setTimeout(() => {
            cleanup()
            reject(new Error("Thumbnail generation timed out"))
        }, timeoutMs)

        const onError = () => {
            window.clearTimeout(timeout)
            cleanup()
            reject(new Error("Failed to load video for thumbnail"))
        }

        // Step 1: load metadata
        video.addEventListener("error", onError, { once: true })

        video.addEventListener(
            "loadedmetadata",
            () => {
                const duration = Number.isFinite(video.duration) ? video.duration : 0

                // Choose capture time
                let t =
                    captureTime === "auto"
                        ? duration
                            ? Math.min(Math.max(duration * 0.1, 0.5), 3) // 10% of video, clamped
                            : 1
                        : captureTime

                // Some browsers need a small seek if t is 0
                if (!Number.isFinite(t) || t < 0.1) t = 0.1
                if (duration && t > duration) t = Math.max(duration - 0.1, 0.1)

                // Step 2: seek to time
                const onSeeked = () => {
                    try {
                        const canvas = document.createElement("canvas")
                        const vw = video.videoWidth || 1280
                        const vh = video.videoHeight || 720
                        const scale = width / vw
                        const outW = width
                        const outH = Math.round(vh * scale)

                        canvas.width = outW
                        canvas.height = outH

                        const ctx = canvas.getContext("2d")
                        if (!ctx) throw new Error("Canvas 2D context unavailable")

                        ctx.drawImage(video, 0, 0, outW, outH)

                        const dataUrl = canvas.toDataURL(mimeType, quality)

                        window.clearTimeout(timeout)
                        cleanup()
                        resolve(dataUrl)
                    } catch (e) {
                        window.clearTimeout(timeout)
                        cleanup()
                        reject(
                            new Error(
                                "Could not extract thumbnail. This is usually a CORS issue (canvas tainted)."
                            )
                        )
                    }
                }

                video.addEventListener("seeked", onSeeked, { once: true })
                // trigger seek
                video.currentTime = t
            },
            { once: true }
        )

        // Start load
        video.src = url
    })
}


const cache = new Map<string, string>()

export function useVideoThumbnail(url?: string, enabled = true) {
    const [thumb, setThumb] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (!url || !enabled) return

        const cached = cache.get(url)
        if (cached) {
            setThumb(cached)
            return
        }

        let cancelled = false
        setLoading(true)
        setError(null)

        generateVideoThumbnail(url, { captureTime: "auto", width: 480 })
            .then((dataUrl) => {
                if (cancelled) return
                cache.set(url, dataUrl)
                setThumb(dataUrl)
            })
            .catch((e) => {
                if (cancelled) return
                setError(e?.message ?? "Failed to create thumbnail")
                setThumb(null)
            })
            .finally(() => {
                if (cancelled) return
                setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [url, enabled])

    return { thumb, loading, error }
}
