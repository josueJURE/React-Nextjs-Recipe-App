import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { switchLabelClassName, switchRowClassName } from "@/utils/const";
import { OnSwithch } from "@/utils/types";

export function SwitchComponent({
  children,
  onChecked,
  onSwitch,
  style,
}: OnSwithch) {
  const switchId = useId();

  return (
    <div className={switchRowClassName}>
      <Label className={switchLabelClassName} htmlFor={switchId}>
        {children}
      </Label>
      <Switch
        onCheckedChange={onSwitch}
        checked={onChecked}
        id={switchId}
        style={style}
      />
    </div>
  );
}
