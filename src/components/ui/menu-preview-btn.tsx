import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import {
  primaryButtonClassName,
  primaryButtonStyle,
} from "@/utils/const";

type MenuPreviewActions = {
  handleMenuDislay: () => void;
  setIsBackToHomePage: Dispatch<SetStateAction<boolean>>;
  handleEmailingUser: () => Promise<void>;
  handleSaveMenu: () => Promise<void>;
};

export function MenuPreviewButtons({
  handleMenuDislay,
  setIsBackToHomePage,
  handleEmailingUser,
  handleSaveMenu,
}: MenuPreviewActions) {
  return (
    <div className="grid gap-3 pt-4 sm:grid-cols-3">
      <Button
        className={primaryButtonClassName}
        style={primaryButtonStyle}
        type="button"
        onClick={() => {
          handleMenuDislay();
          setIsBackToHomePage(false);
        }}
      >
        Back to home page
      </Button>
      <Button
        className={primaryButtonClassName}
        style={primaryButtonStyle}
        type="button"
        onClick={handleEmailingUser}
      >
        Send to my inbox
      </Button>
      <Button
        type="button"
        onClick={handleSaveMenu}
        className={primaryButtonClassName}
        style={primaryButtonStyle}
      >
        Save recipe
      </Button>
    </div>
  );
}
