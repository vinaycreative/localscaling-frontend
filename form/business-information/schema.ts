import z from "zod"

export const businessInformationFormSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  start_year: z.string().min(1, "Start year is required"),
  address: z.string().min(1, "Street address is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  vat_id: z.string().min(1, "VAT ID is required"),
  contact_name: z.string().min(1, "Contact name is required"),
  contact_email: z.string().email("Invalid email"),
  contact_number: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  whatsapp_number: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid WhatsApp number")
    .optional()
    .or(z.literal("")),
  website: z.string().min(1).url("Invalid URL"),
  facebook: z.union([z.literal(""), z.url({ message: "Invalid Facebook URL" })]),
  instagram: z.union([z.literal(""), z.url({ message: "Invalid Instagram URL" })]),
  x: z.union([z.literal(""), z.url({ message: "Invalid Twitter URL" })]),
  google_business_profile_link: z.union([
    z.literal(""),
    z.url({ message: "Invalid Google Business Profile URL" }),
  ]),
})
