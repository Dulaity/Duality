import { z } from "zod";

const passwordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters.")
  .max(72, "Password must be 72 characters or less.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[0-9]/, "Password must include a number.");

export const registerRequestSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
    email: z.string().trim().email("Enter a valid email address.").max(120),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const signInRequestSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(120),
  password: z.string().min(1, "Enter your password."),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type SignInRequest = z.infer<typeof signInRequestSchema>;
