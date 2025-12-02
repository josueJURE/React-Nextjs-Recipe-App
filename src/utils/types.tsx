// types/forms.ts
import { z } from "zod";
import { registerFormSchema } from "@/lib/validation-schemas";

// ✅ inferred type from schema
type RegisterFormValues = z.infer<typeof registerFormSchema>;

// ✅ extend with register prop for RHF
export type RegisterFormWithHook = RegisterFormValues & {
  register?: (name: string) => void;
};

export interface ApiResponse {
  recipe: string;
  emailId?: string;
  success: boolean;
  recipeImage?: string;
}

export interface ButtonTypes {
  width: `w-${number}`;
  type: "button";
  label: string;
  onClick?: () => void;
  onRemoveImage?: () => void;
  onInboxBtn?: () => void;
}

export interface DietaryDataType {
  vegan: boolean;
  other: { checked: boolean; text: string };
}

export interface MapProps {
  handleCountrySelect: (countryName: string) => void;
  isDarkMode: boolean;
}

export interface GeographyFeature {
  rsmKey: string;
  properties: Record<string, string>;
}

export interface RecipeUIProps {
  email: string;
  name: string;
  vegan: boolean;
}


export interface DietaryRequirementsProps {
  vegan: boolean;
  onVeganToggle: (checked: boolean) => void;
  onOtherToggle?: (checked: boolean) => void;
}