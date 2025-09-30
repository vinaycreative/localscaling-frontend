import * as z from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)]?)?([-]?[\s]?[0-9])+$/
);

const urlRefinement = (val: string) =>
  z.string().safeParse(`https://${val}`).success ||
  z.string().safeParse(val).success;

export const BusinessFormSchema = z.object({
  company: z.string().min(1, { message: "Company name is required." }),
  contactName: z.string().min(1, { message: "Contact name is required." }),
  email: z.string().min(1, { message: "Email is required." }).email({
    message: "Must be a valid email address.",
  }),
  contactNumber: z
    .string()
    .min(1, { message: "Contact number is required." })
    .regex(phoneRegex, { message: "Invalid phone number format." }),

  whatsappNumber: z
    .string()
    .min(1, { message: "WhatsApp number is required." })
    .regex(phoneRegex, { message: "Invalid WhatsApp number format." }),

  website: z
    .string()
    .min(1, { message: "Website is required." })
    .refine(urlRefinement, {
      message: "Must be a valid URL.",
    }),

  facebook: z
    .string()
    .min(1, { message: "Facebook link is required." })
    .refine(urlRefinement, {
      message: "Must be a valid URL.",
    }),

  instagram: z
    .string()
    .min(1, { message: "Instagram link is required." })
    .refine(urlRefinement, {
      message: "Must be a valid URL.",
    }),
});

export type BusinessFormData = z.infer<typeof BusinessFormSchema>;
