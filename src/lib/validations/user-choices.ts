import { z } from "zod";

export const userChoicesSchema = z.object({
  country: z
    .string()
    .min(1, "Country name is required")
    .trim()
    .max(100, "Country name is too long"),
  vegan: z.boolean(),
});

export type UserChoices = z.infer<typeof userChoicesSchema>;

