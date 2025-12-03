import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import type {DietaryRequirementsProps} from "@/utils/types"


function DietaryRequirements({ vegan, onVeganToggle, onOtherToggle }: DietaryRequirementsProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleVeganChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    try {
      setIsUpdating(true);

      // Call API to update the vegan preference
      const response = await fetch("/api/user/dietary-preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vegan: checked }),
      });

      if (!response.ok) {
        throw new Error("Failed to update preference");
      }

      const data = await response.json();

      // console.log(data.pays)



      // Update the parent component's state
      onVeganToggle(data.vegan);

      toast.success(`Vegan preference ${checked ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Error updating vegan preference:", error);
      toast.error("Failed to update preference");
      // Revert the checkbox if the API call fails
      e.target.checked = !checked;
    } finally {
      setIsUpdating(false);
    }
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
          disabled={isUpdating}
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
