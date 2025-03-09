import * as z from "zod";

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" })
      .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: "Invalid email address",
      }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(24, { message: "Password must not exceed 24 characters" })
      .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/^(?=.*\d)/, {
        message: "Password must contain at least one number",
      })
      .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ISignupSchema = z.infer<typeof signupSchema>;
