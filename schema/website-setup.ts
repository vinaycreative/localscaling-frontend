import * as z from "zod";

const requiredString = z.string().min(1, "This field is required.");

export const WebsiteSetupSchema = z.object({
  contentFiles: requiredString.min(1, "Content file upload is required."),
  legalPages: requiredString.min(1, "Legal pages upload is required."),
});

export type WebsiteSetupFormData = z.infer<typeof WebsiteSetupSchema>;
