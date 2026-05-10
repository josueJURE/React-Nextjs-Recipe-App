import { Dispatch, SetStateAction, Suspense, lazy } from "react";
import {
  previewShellClassName,
  previewSurfaceClassName,
  previewTextareaClassName,
} from "@/utils/const";
import { AudioSkeleton } from "@/components/ui/audio-skeleton";
import { MenuPreviewButtonsSkeleton } from "@/components/ui/menu-preview-skeleton";

import { MenuPreviewButtons } from "@/components/ui/menu-preview-btn";

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
      <div className="w-full">
        {isMenuDisplayed ? (
          <div className={previewShellClassName}>
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
                rows={1}
                readOnly
              />

              {isGeneratingAudio ? (
                <MenuPreviewButtonsSkeleton />
              ) : recipeAudio ? (
                <Suspense fallback={<MenuPreviewButtonsSkeleton />}>
                  <MenuPreviewButtons
                    handleMenuDislay={handleMenuDislay}
                    setIsBackToHomePage={setIsBackToHomePage}
                    handleEmailingUser={handleEmailingUser}
                    handleSaveMenu={handleSaveMenu}
                  />
                </Suspense>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex min-h-[320px] items-center justify-center text-center text-sm leading-6 text-[#657167] sm:text-base">
            Your generated recipe preview will appear here after you pick a
            country and start generation.
          </div>
        )}
      </div>
    </>
  );
}
