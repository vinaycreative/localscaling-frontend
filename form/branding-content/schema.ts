import z from "zod"

const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i

export const brandingContentSchema = z.object({
  font_link: z.union([z.literal(""), z.string().url({ message: "Invalid Font URL" })]),
 primary_brand_color: z
    .string()
    .regex(hexColorRegex, { message: "Invalid Primary Brand Color (Hex)" }),
  secondary_brand_color:z
    .string()
    .regex(hexColorRegex, { message: "Invalid Secondary Brand Color (Hex)" }),
  logo_file: z.any().nullable(),
  team_photos: z.any().nullable(),
  team_members: z.array(
    z.object({
      name: z.string().min(1, "Name required"),
      position: z.string().min(1, "Position required"),
    })
  ),
  video_creation_option: z.enum(["upload", "studio", "remote"]),
  ceo_video: z.any().nullable(),
  video_testimonial: z.any().nullable(),
})
