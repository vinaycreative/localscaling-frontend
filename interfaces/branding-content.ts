export type IntroductoryVideoOption = "upload" | "studio" | "remote";

export interface OnboardingVideoProps {
  step: number;
}

export interface TeamMember {
  name: string;
  position: string;
}

export interface BrandingContentFormData {
  fontLink: string;
  primaryBrandColor: string;
  secondaryBrandColor: string;
  logoFile: File | null;
  teamPhotos: File[] | null;
  teamMembers: TeamMember[];
  ceoVideo: File | null;
  videoCreationOption: IntroductoryVideoOption;
  videoTestimonial: File | null;
}
