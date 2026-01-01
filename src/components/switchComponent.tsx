import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { OnSwithch } from "@/utils/types";

export function SwitchComponent({ children, onChecked, onSwitch }: OnSwithch) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        onCheckedChange={onSwitch}
        checked={onChecked}
        id="airplane-mode"
      />
      <Label htmlFor="airplane-mode">{children}</Label>
    </div>
  );
}
