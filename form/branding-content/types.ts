import z from "zod"
import { brandingContentSchema } from "./schema"

export type BrandingContentFormValues = z.infer<typeof brandingContentSchema>

export interface TeamMember {
  name: string
  position: string
}

export type IntroductoryVideoOption = "upload" | "studio" | "remote"

export interface BrandingInfoPayload {
  font_link: string
  primary_brand_color: string
  secondary_brand_color: string
  logo_url: string
  team_photo_urls: string[]
  team_members: TeamMember[]
  video_creation_option: IntroductoryVideoOption
  ceo_video_url: string | null
  video_testimonial_url: string | null
}
