import { Dispatch, SetStateAction, Suspense, lazy } from "react";
import {

  cardClassName,
  previewTextareaClassName,
  primaryButtonClassName,
  primaryButtonStyle,
} from "@/utils/const";
import { AudioSkeleton } from "@/components/ui/audio-skeleton";
import { Button } from "@/components/ui/button";
import { SpinnerButton } from "@/components/ui/spinnerButton";
import {MenuPreviewButtons} from "@/components/ui/menu-preview-btn"


const RecipeAudioPlayer = lazy(() => import("./recipe-audio-player"));

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

type MenuPreviewProps = {
  preview: MenuPreviewState;
  actions: MenuPreviewActions;
};

export function MenuPreview({
  preview: {
    isMenuDisplayed,
    isGeneratingAudio,
    backgroundPicture,
    recipeAudio,
    menuContent,
    isGeneratingImage,
    isBackToHomePage,
  },
  actions: {
    handleMenuDislay,
    setIsBackToHomePage,
    handleEmailingUser,
    handleSaveMenu,
  },
}: MenuPreviewProps) {
  return (
    <>
      <div className="flex justify-center h-screen">
        {isMenuDisplayed ? (
          <div
            className={`${cardClassName} w-5xl`}
            // className={previewSurfaceClassName}
            style={{
              backgroundImage: backgroundPicture
                ? `url(${backgroundPicture})`
                : undefined,
            }}
          >
            {isGeneratingAudio ? (
              <AudioSkeleton />
            ) : recipeAudio ? (
              <Suspense fallback={<AudioSkeleton />}>
                <RecipeAudioPlayer url={recipeAudio} />
              </Suspense>
            ) : null}

            <textarea
              className={previewTextareaClassName}
              value={menuContent}
              rows={1}
              cols={60}
              readOnly
            />

            {isGeneratingImage && (
              <div className="pt-4">
                <SpinnerButton label="Loading Image" />
              </div>
            )}

            {isBackToHomePage && (
              <MenuPreviewButtons handleMenuDislay={handleMenuDislay}
              setIsBackToHomePage={setIsBackToHomePage}
              handleEmailingUser={handleEmailingUser}
              handleSaveMenu={handleSaveMenu}

              />
          
            )}
          </div>
        ) : (
          <div className="flex min-h-[460px] items-center justify-center text-center text-lg text-[#8b7d74] sm:text-xl">
            Your generated recipe preview will appear here after you pick a
            country and start generation.
          </div>
        )}
      </div>
    </>
  );
}
