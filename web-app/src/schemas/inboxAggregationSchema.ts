import { z } from "zod";

// Zod schema definitions
const emailCredentialSchema = z.object({
  emailAddress: z.string().email("Invalid email format"),
  appPassword: z.string().min(8, "Password must be at least 8 characters"),
});

const searchCriteriaSchema = z.object({
  dateRange: z
    .object({
      start: z.string().min(1, "Start date is required"),
      end: z.string().min(1, "End date is required"),
    })
    .refine(
      (data) => new Date(data.start) <= new Date(data.end), // Changed >= to <=
      "Start date must be before or equal to end date"
    )
    .refine(
      (data) => new Date(data.start) < new Date(Date.now()), // Ensures start is at least one day before today
      "Start date must be at least one day before today's date"
    ),
  filters: z.object({
    subject: z.string(),
    body: z.string(),
    senderAddress: z
      .string()
      .email("Invalid sender email")
      .optional()
      .or(z.literal("")),
  }),
});

export const formSchema = z.object({
  emailCredentials: z
    .array(emailCredentialSchema)
    .min(1, "At least one email account is required"),
  searchCriteria: searchCriteriaSchema,
  targetSpreadsheetId: z.string().min(1, "Please select a target spreadsheet"),
});
