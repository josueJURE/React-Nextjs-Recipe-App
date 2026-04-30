import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from  "react"
import {
 
    primaryButtonClassName,
    primaryButtonStyle,
  } from "@/utils/const";

  type MenuPreviewState = {
    isMenuDisplayed: boolean;
    isGeneratingAudio: boolean;
    isGeneratingImage: boolean;
    isBackToHomePage: boolean;
    backgroundPicture: string;
    recipeAudio: string | null;
    menuContent: string;
  };


  type MenuPreviewActions = {
    handleMenuDislay: () => void;
    setIsBackToHomePage: Dispatch<SetStateAction<boolean>>;
    handleEmailingUser: () => Promise<void>;
    handleSaveMenu: () => Promise<void>;
  };



export  function MenuPreviewButtons({handleMenuDislay, setIsBackToHomePage, handleEmailingUser, handleSaveMenu} : MenuPreviewActions  ) {
    return (
        <div className="space-y-3  flex flex-col items-center ">
        <Button
          className={`${primaryButtonClassName}  size-[400px] `}
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
          className={`${primaryButtonClassName}   size-[400px]`}
          style={primaryButtonStyle}
          type="button"
          onClick={handleEmailingUser}
        >
          Send to my inbox
        </Button>
        <Button
          type="button"
          onClick={handleSaveMenu}
          className={`${primaryButtonClassName}  size-[400px]`}
          style={primaryButtonStyle}
        >
          Save recipe
        </Button>
      </div>
    )
}