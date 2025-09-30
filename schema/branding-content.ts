import * as z from "zod";

export const BrandingSchema = z.object({
  fontLink: z.string().nonempty("Font Link cannot be empty."),
  brandColor: z.string().nonempty("Brand Colors cannot be empty."),
  logo: z.string().nonempty("Company logo upload is required."),
  teamPhotos: z.string().nonempty("Team photos upload is required."),
  introVideo: z.string().nonempty("Intro video upload is required."),
  videoTestimonial: z
    .string()
    .nonempty("Video testimonials upload is required."),
});

export type BrandingFormData = z.infer<typeof BrandingSchema>;
