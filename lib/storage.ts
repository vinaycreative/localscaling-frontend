import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type StorageBucket = "branding-assets" | "videos" | "documents";

export async function uploadFileToStorage(
  file: File,
  bucket: StorageBucket,
  folder: string = "uploads"
): Promise<string> {
  // 1. Sanitize file name to avoid issues with spaces or special characters
  const fileExt = file.name.split(".").pop();
  // Take first 30 chars of name, replace non-alphanumeric with dash
  const cleanName = file.name
    .split(".")[0]
    .replace(/[^a-zA-Z0-9]/g, "-")
    .substring(0, 30);
  const fileName = `${cleanName}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  console.log(`[Storage] Uploading ${file.name} to ${bucket}/${filePath}...`);

  // 2. Upload
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error(`[Storage] Error uploading to ${bucket}:`, error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  // 3. Get Public URL
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  console.log(`[Storage] Upload success: ${data.publicUrl}`);
  return data.publicUrl;
}
