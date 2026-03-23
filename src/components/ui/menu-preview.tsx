import { lazy, SetStateAction } from "react";
import {
  previewShellClassName,
  previewSurfaceClassName,
  previewTextareaClassName,
  primaryButtonClassName,
  primaryButtonStyle,
} from "@/utils/const";
import { AudioSkeleton } from "@/components/ui/audio-skeleton";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { SpinnerButton } from "@/components/ui/spinnerButton";

const RecipeAudioPlayer = lazy(() => import("./recipe-audio-player"));

type MenuPreviewProps = {
  isMenuDisplayed: boolean;
  isGeneratingAudio: boolean;
  isGeneratingImage: boolean;
  isBackToHomePage: boolean;
  backgroundPicture: string;
  recipeAudio: string | null;
  menuContent: string;

  handleMenuDislay: () => void;
  setIsBackToHomePage: (value: SetStateAction<boolean>) => void;
  handleEmailingUser: () => Promise<void>;
  handleSaveMenu: () => Promise<void>;
};

export function MenuPreview({
  isMenuDisplayed,
  isGeneratingAudio,
  backgroundPicture,
  recipeAudio,
  menuContent,
  isGeneratingImage,
  isBackToHomePage,
  handleMenuDislay,
  setIsBackToHomePage,
  handleEmailingUser,
  handleSaveMenu,
}: MenuPreviewProps) {
  return (
    <>
      <div className={previewShellClassName}>
        {isMenuDisplayed ? (
          <div
            className={previewSurfaceClassName}
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
              rows={25}
              cols={60}
              readOnly
            />

            {isGeneratingImage && (
              <div className="pt-4">
                <SpinnerButton label="Loading Image" />
              </div>
            )}

            {isBackToHomePage && (
              <div className="grid gap-3 pt-4 md:grid-cols-3">
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
