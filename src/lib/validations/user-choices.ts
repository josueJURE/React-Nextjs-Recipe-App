import { z } from "zod";

// Auth schemas
export const registerFormSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
  confirmPassword: z.string().min(2).max(50).optional(),
});

export const signInFormSchema = registerFormSchema.pick({
  email: true,
  password: true,
});

// User choices schema
export const userChoicesSchema = z.object({
  country: z
    .string()
    .min(2, "Country name is required")
    .trim()
    .max(100, "Country name is too long"),
  vegan: z.boolean(),
  other: z.string().max(56, "Additional note is too long").default(""),
});

export const userPreference = userChoicesSchema.pick({
  vegan: true,
});

export const userInbox = z.object({
  menuContent: z.string().trim().min(1, "Menu content cannot be empty"),
});

// Export types
export type RegisterForm = z.infer<typeof registerFormSchema>;
export type SignInForm = z.infer<typeof signInFormSchema>;
export type UserChoices = z.infer<typeof userChoicesSchema>;
export type UserPreference = z.infer<typeof userPreference>;
export type UserInbox = z.infer<typeof userInbox>;
