import { z } from "zod";

export const userChoicesSchema = z.object({
  country: z
    .string()
    .min(2, "Country name is required")
    .trim()
    .max(100, "Country name is too long"),
  vegan: z.boolean(),
  other: z
    .string()
    .max(56, "Additional note is too long")
    .default("")
});

export type UserChoices = z.infer<typeof userChoicesSchema>;

