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

// export async function uploadFileToStorage(
//   file: File,
//   bucket: StorageBucket,
//   folder: string = "client"
// ): Promise<string> {
//   // 1. Sanitize file name to avoid issues with spaces or special characters
//   const fileExt = file.name.split(".").pop()
//   // Take first 30 chars of name, replace non-alphanumeric with dash
//   const cleanName = file.name
//     .split(".")[0]
//     .replace(/[^a-zA-Z0-9]/g, "-")
//     .substring(0, 30)
//   const fileName = `${cleanName}-${Date.now()}.${fileExt}`
//   const filePath = `${folder}/${fileName}`

//   console.log(`[Storage] Uploading ${file.name} to ${bucket}/${filePath}...`)

//   // 2. Upload
//   const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
//     cacheControl: "3600",
//     upsert: false,
//   })

//   if (error) {
//     console.error(`[Storage] Error uploading to ${bucket}:`, error)
//     throw new Error(`Upload failed: ${error.message}`)
//   }

//   // 3. Get Public URL
//   const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

//   console.log(`[Storage] Upload success: ${data.publicUrl}`)
//   return data.publicUrl
// }

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
    contentType: file.type,
  })
  if (error) {
    console.error(`[Storage] Error uploading to ${bucket}:`, error)
    throw new Error(`Upload failed: ${error.message}`)
  }
  // 3. Get Public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(`client/${userId}/${name}`)

  console.log(`[Storage] Upload success: ${publicUrlData.publicUrl}`)
  return publicUrlData.publicUrl
}
