"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DietaryRequirementsProps } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateVeganPreference } from "@/lib/queries/recipes";

function DietaryRequirements({
  vegan,
  onVeganToggle,
  onOtherToggle,
}: DietaryRequirementsProps) {
  const veganPreferenceMutation = useMutation({
    mutationFn: updateVeganPreference,
    onSuccess: (result, checked) => {
      onVeganToggle(result.vegan);
      toast.success(`Vegan preference ${checked ? "enabled" : "disabled"}`);
    },
    onError: (error, checked) => {
      onVeganToggle(!checked);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update vegan preference"
      );
    },
  });

  const handleVeganChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    // Optimistic update so the toggle feels instant.
    onVeganToggle(checked);
    veganPreferenceMutation.mutate(checked);
  };

  return (
    <div>
      <h1>Indicate any diatery requirements</h1>
      <div className="flex items-center gap-4 pt-4">
        <Label htmlFor="vegan">Vegan</Label>
        <Input
          className="h-4"
          id="vegan"
          type="checkbox"
          checked={vegan}
          onChange={handleVeganChange}
          disabled={veganPreferenceMutation.isPending}
        />
        <Label htmlFor="other">Other</Label>

        <Input
          onChange={(e) => onOtherToggle?.(e.target.checked)}
          className="h-4"
          id="other"
          type="checkbox"
        />
      </div>
    </div>
  );
}

export default DietaryRequirements;
