import { z } from "zod";

export const WebsiteSetupSchema = z
  .object({
    domainProvider: z.string().min(1, "Please select a domain provider"),
    accessGranted: z.boolean().refine((v) => v === true, {
      message: "Please grant access to continue",
    }),
    businessClients: z
      .array(z.string().min(1))
      .min(1, "Enter at least one client"),
    legalUpload: z.string().optional(),
    legalLinks: z.array(z.string().url("Please enter a valid URL")).optional(),
    seoLocations: z
      .array(z.string().min(1))
      .min(1, "Add at least one location"),
  })
  .refine(
    (data) => {
      const hasUpload =
        !!data.legalUpload && data.legalUpload.trim().length > 0;
      const hasLinks =
        Array.isArray(data.legalLinks) && data.legalLinks.length > 0;
      return hasUpload || hasLinks;
    },
    {
      path: ["legalUpload"],
      message: "Upload a legal document or add at least one URL",
    }
  );

export type WebsiteSetupFormData = z.infer<typeof WebsiteSetupSchema>;
