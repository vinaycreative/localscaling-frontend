export const CATEGORIES = [
  { label: "Website", value: "Website" },
  { label: "CRM", value: "CRM" },
  { label: "Billing", value: "Billing" },
  { label: "System", value: "System" },
  { label: "Mobile App", value: "Mobile App" },
  { label: "Backend", value: "Backend" },
  { label: "E-commerce", value: "E-Commerce" },
] as {
  label: string
  value: "Website" | "CRM" | "Billing" | "System" | "Mobile App" | "Backend" | "E-Commerce"
}[]

export type CATEGORIES_TYPE = (typeof CATEGORIES)[number]["value"]

export const PRIORITIES = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
] as { label: string; value: "low" | "medium" | "high" }[]

export type PRIORITIES_TYPE = (typeof PRIORITIES)[number]["value"]

export const STATUS = [
  { label: "Open", value: "open" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Closed", value: "closed" },
  { label: "Cancelled", value: "cancelled" },
] as {
  label: string
  value: "open" | "pending" | "in_progress" | "closed" | "cancelled"
}[]

export type STATUS_TYPE = (typeof STATUS)[number]["value"]
