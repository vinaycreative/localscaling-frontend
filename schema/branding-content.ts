import * as z from "zod";

export const BrandingSchema = z.object({
  fontLink: z.string().nonempty("Font Link cannot be empty."),
  primaryBrandColor: z.string().optional(),
  secondaryBrandColor: z.string().optional(),
  logo: z.string().nonempty("Company logo upload is required."),
  teamPhotos: z.string().nonempty("Team photos upload is required."),
  teamMemberName: z.string().nonempty("Team member name is required."),
  teamMemberPosition: z.string().nonempty("Team member position is required."),
});

export type BrandingFormData = z.infer<typeof BrandingSchema>;
