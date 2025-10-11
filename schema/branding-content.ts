import * as z from "zod";

const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;

export const BrandingSchema = z.object({
  fontLink: z.string().nonempty("Font Link cannot be empty."),

  primaryBrandColor: z
    .string()
    .regex(hexColorRegex, "Must be a valid hex color code (e.g., #RRGGBB).")
    .optional(),
  secondaryBrandColor: z
    .string()
    .regex(hexColorRegex, "Must be a valid hex color code (e.g., #RRGGBB).")
    .optional(),

  logo: z
    .any()
    .refine((val) => val instanceof FileList && val.length > 0, {
      message: "Company logo upload is required.",
    })
    .refine((val) => val instanceof FileList && val[0].size <= 5000000, {
      message: "Logo must be less than 5MB.",
    }),

  teamPhotos: z
    .any()
    .refine((val) => val instanceof FileList && val.length > 0, {
      message: "Team photos upload is required.",
    }),

  teamMemberName: z.string().nonempty("Team member name is required."),
  teamMemberPosition: z.string().nonempty("Team member position is required."),
});

export type BrandingFormData = z.infer<typeof BrandingSchema>;
