import { useState } from "react";
import { toast } from "sonner";

import { SwitchComponent } from "@/components/switchComponent";
import { sectionHeadingClassName, themeColor } from "@/utils/const";
import type { DietaryRequirementsProps } from "@/utils/types";

function DietaryRequirements({
  vegan,
  otherChecked = false,
  onVeganToggle,
  onOtherToggle,
}: DietaryRequirementsProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleVeganChange = async (checked: boolean) => {
    try {
      setIsUpdating(true);

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

      onVeganToggle(data.vegan);
      toast.success(`Vegan preference ${checked ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Error updating vegan preference:", error);
      toast.error("Failed to update preference");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className={sectionHeadingClassName}>Dietary requirements</h2>

      <div className="space-y-3">
        <SwitchComponent
          onSwitch={handleVeganChange}
          onChecked={vegan}
          style={{ backgroundColor: themeColor, opacity: isUpdating ? 0.6 : 1 }}
        >
          Vegan
        </SwitchComponent>

        <SwitchComponent
          onSwitch={(checked) => onOtherToggle?.(checked)}
          onChecked={otherChecked}
          style={{ backgroundColor: themeColor }}
        >
          Other dietary requirements
        </SwitchComponent>
      </div>
    </div>
  );
}

export default DietaryRequirements;
