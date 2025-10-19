export type VideoCreationOption = "upload" | "studio" | "remote";

export interface OnboardingVideoProps {
  step: number;
}

export interface CeoVideoData {
  file?: File;
  url?: string;
  preview?: string;
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
  ceoVideo: CeoVideoData | null;
  videoCreationOption: VideoCreationOption;
}
