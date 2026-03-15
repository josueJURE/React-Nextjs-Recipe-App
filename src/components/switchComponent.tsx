import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { OnSwithch } from "@/utils/types";

export function SwitchComponent({ children, onChecked, onSwitch }: OnSwithch) {
  const switchId = useId();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        onCheckedChange={onSwitch}
        checked={onChecked}
        id={switchId}
      />
      <Label htmlFor={switchId}>{children}</Label>
    </div>
  );
}
