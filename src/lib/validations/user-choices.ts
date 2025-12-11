import { z } from "zod";

export const userChoicesSchema = z.object({
  country: z
    .string()
    .min(2, "Country name is required")
    .trim()
    .max(100, "Country name is too long"),
  vegan: z.boolean(),
  other: z.string().min(2, "Country name is required")
  .trim()
  .max(56, "Country name is too long" )
});

export type UserChoices = z.infer<typeof userChoicesSchema>;

