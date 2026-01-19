import { createClient } from "@supabase/supabase-js"

let supabaseClient: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    )
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

export type StorageBucket = "branding-assets" | "videos" | "documents"

export const getFileNameFromUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url)
    const pathname = parsedUrl.pathname
    const name = pathname.substring(pathname.lastIndexOf("/") + 1)

    return name || "file"
  } catch {
    return "file"
  }
}

export const getFileNameFromHeaders = (res: Response): string | null => {
  const disposition = res.headers.get("Content-Disposition")
  if (!disposition) return null

  // Handles: attachment; filename="example.png"
  const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^"]+)/i)
  return match ? decodeURIComponent(match[1]) : null
}

export interface UploadedFile extends File {
  uploaded?: boolean
}

export const urlToFile = async (url: string): Promise<UploadedFile> => {
  if (!url) return new File([], "file")

  try {
    const res = await fetch(url)
    const blob = await res.blob()

    const filename = getFileNameFromHeaders(res) || getFileNameFromUrl(url)

    const file = new File([blob], filename, {
      type: blob.type || res.headers.get("Content-Type") || "application/octet-stream",
    }) as UploadedFile
    file.uploaded = true

    return file
  } catch (e) {
    console.error("Error converting URL to File:", e)
    return new File([], "file")
  }
}

export async function uploadFileToStorage(
  file: File,
  name: string,
  userId: string
): Promise<string> {
  if (!userId) {
    throw new Error("User ID is required")
  }
  const supabase = getSupabaseClient()
  const bucket = "client"
  const { data, error } = await supabase.storage.from("client").upload(`${userId}/${name}`, file, {
    contentType: file?.type || "application/octet-stream",
    upsert: true, // ✅ overwrite if exists
  })
  if (error) {
    console.error(`[Storage] Error uploading to ${bucket}:`, error)
    throw new Error(`Upload failed: ${error.message}`)
  }
  // 3. Get Public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(`/${userId}/${name}`)

  console.log(`[Storage] Upload success: ${publicUrlData.publicUrl}`)
  return publicUrlData.publicUrl
}
