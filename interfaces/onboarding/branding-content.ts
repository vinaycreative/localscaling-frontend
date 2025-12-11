export type IntroductoryVideoOption = "upload" | "studio" | "remote"

export interface OnboardingVideoProps {
  step: number
}

export interface TeamMember {
  name: string
  position: string
}

export interface BrandingContentFormData {
  font_link: string
  primary_brand_color: string
  secondary_brand_color: string
  logo_file: File | null
  team_photos: File[] | null
  team_members: TeamMember[]
  ceo_video: File | null
  video_creation_option: IntroductoryVideoOption
  video_testimonial: File | null
}

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
