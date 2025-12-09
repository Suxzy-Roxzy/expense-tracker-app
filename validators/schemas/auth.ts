import { email, z } from "zod";

export const signupSchema = z.object({
  email: z.email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const singleEmailSchema = z.object({
  email: z.email("Invalid email address"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const verifyTokenSchema = z.object({
  token: z.string(),
});

export const passwordResetRequestSchema = z.object({
  email: z.email("Invalid email address"),
});

export const passwordResetConfirmSchema = z.object({
  old_password: z
    .string()
    .min(6, "Old password must be at least 6 characters long"),
  new_password: z
    .string()
    .min(6, "New password must be at least 6 characters long"),
});

export const passwordResetSchema = z.object({
  old_password: z.string(),
  confirm_new_password: z.string(),
  new_password: z.string(),
});

// 2FA SCHEMAS
export const Resend2FASchema = z.object({
  email: z.email(),
});

// ALL INFERED TYPES
export type SingleEmailSchemaType = z.infer<typeof singleEmailSchema>;
export type verifyTokenSchemaType = z.infer<typeof verifyTokenSchema>;
export type SignupSchemaType = z.infer<typeof signupSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type passwordResetRequestSchemaType = z.infer<
  typeof passwordResetRequestSchema
>;
export type passwordResetConfirmSchemaType = z.infer<
  typeof passwordResetConfirmSchema
>;
export type passwordResetSchemaType = z.infer<typeof passwordResetSchema>;

// EXPORT 2FA TYPE
export type Resend2FASchemaType = z.infer<typeof Resend2FASchema>;
