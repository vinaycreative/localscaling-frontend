import * as z from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)]?)?([-]?[\s]?[0-9])+$/
);

const currentYear = new Date().getFullYear();

export const BusinessFormSchema = z.object({
  company: z.string().min(1, { message: "Company name is required." }),
  startYear: z
    .string()
    .min(1, { message: "Start year is required." })
    .regex(/^\d{4}$/, { message: "Must be a 4-digit year." })
    .refine((val) => parseInt(val) >= 1900 && parseInt(val) <= currentYear, {
      message: `Year must be between 1900 and ${currentYear}.`,
    }),
  vatId: z.string(),

  streetAddress: z.string().min(1, { message: "Street Address is required." }),
  postalCode: z.string().min(1, { message: "Postal Code is required." }),
  city: z.string().min(1, { message: "City is required." }),
  state: z.string().min(1, { message: "State/Province is required." }),
  country: z.string().min(1, { message: "Country is required." }),

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
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Invalid WhatsApp number format.",
    }),

  website: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  googleBusinessProfileLink: z.string().optional(),
});

export type BusinessFormData = z.infer<typeof BusinessFormSchema>;
