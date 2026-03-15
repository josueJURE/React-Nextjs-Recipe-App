"use client";

import Map from "@/components/map";
import { Button } from "@/components/ui/button";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  countrySchema,
  recipeContentSchema,
  userInbox,
} from "@/lib/validations/user-choices";
import { SwitchComponent } from "@/components/switchComponent";
import { SpinnerButton } from "./spinnerButton";
import Link from "next/link";
import {
  handleSavedMenuResponse,
  handleCountrySelectionResponse,
} from "@/lib/queries/recipes";
import postJson from "@/lib/fetchFunction/fetchFunction";
import { signOut, useSession } from "@/lib/auth-client";
import { AudioSkeleton } from "./audio-skeleton";
import { Card } from "@/components/ui/card";
import DietaryRequirements from "@/components/ui/dietary-requirements";
import { Input } from "@/components/ui/input";
import type { RecipeUIProps } from "@/utils/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const RecipeAudioPlayer = lazy(() => import("./recipe-audio-player"));

export default function RecipeUIClient(userProps: RecipeUIProps) {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [recipes, setRecipes] = useState<unknown[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMenuDisplayed, setIsMenuDisplayed] = useState<boolean>(false);
  const [menuContent, setMenuContent] = useState<string>("");
  const [isBackToHomePage, setIsBackToHomePage] = useState<boolean>(false);
  const [shouldGenerateAudio, setShouldGenerateAudio] =
    useState<boolean>(true);
  const [shouldGenerateImage, setShouldGenerateImage] =
    useState<boolean>(true);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [backgroundPicture, setIsBckgroundPicture] = useState<string>("");
  const [vegan, setVegan] = useState<boolean>(userProps.vegan);
  const [otherDietaryRequirements, setOtherDietaryRequirements] =
    useState<boolean>(false);
  const [userOtherDietaryRequirements, setuserOtherDietaryRequirements] =
    useState<string>("");
  const [recipeAudio, setRecipeAudio] = useState<string | null>(null);
  const isDarkMode = false;

  const handleVeganToggle = (onChecked: boolean) => {
    setVegan(onChecked);
  };

  const handleAudioGeneration = (checked: boolean) => {
    setShouldGenerateAudio(checked);
  };

  const handleImageGeneration = (checked: boolean) => {
    setShouldGenerateImage(checked);
  };

  const handleDietaryRequirements = (onChecked: boolean) => {
    setOtherDietaryRequirements(onChecked);
  };

  const handleCountrySelect = (countryName: string) => {
    if (!countryName) return;
    setSelectedCountry(countryName);
  };

  const handleuserOtherDietaryRequirements = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setuserOtherDietaryRequirements(e.target.value);
  };

  const handleMenuDislay = () => {
    setIsMenuDisplayed((prev) => !prev);
  };

  const handleSaveMenu = async () => {
    const recipeContentSchemaValidation =
      recipeContentSchema.safeParse(menuContent);
    if (!recipeContentSchemaValidation.success) {
      toast("invalid input");
      return;
    }

    try {
      await handleSavedMenuResponse(menuContent);
    } catch (error) {
      console.error(error);
      toast("Something went wrong");
    }
  };

  const handleCountrySelection = async () => {
    const countrySchemaValidation = countrySchema.safeParse(selectedCountry);

    if (!countrySchemaValidation.success) {
      toast(
        `${countrySchemaValidation.error.issues[0]?.message ?? "Invalid input"}`
      );
      return;
    }

    setIsMenuDisplayed(true);
    setIsBackToHomePage(false);
    setMenuContent("");
    setRecipeAudio(null);
    setIsBckgroundPicture("");
    setIsGeneratingAudio(shouldGenerateAudio);
    setIsGeneratingImage(shouldGenerateImage);

    try {
      const response = await handleCountrySelectionResponse({
        selectedCountry,
        vegan,
        userOtherDietaryRequirements,
        isImageGenerated: shouldGenerateImage,
      });

      let accumulatedContent = "";
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Recipe stream was not available");
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const text = decoder.decode(value, { stream: true });
        accumulatedContent += text;
        setMenuContent((prev) => prev + text);
      }

      const finalText = decoder.decode();
      if (finalText) {
        accumulatedContent += finalText;
        setMenuContent((prev) => prev + finalText);
      }

      const imageRequest = shouldGenerateImage
        ? postJson<{ backGroundPicture: string }>(
            "/api/user/image-post-request",
            {
              menuContent: accumulatedContent,
            }
          )
            .then((imageData) => {
              setIsBckgroundPicture(imageData.backGroundPicture);
            })
            .catch((imageError) => {
              console.error(imageError);
              toast("Image generation failed");
            })
            .finally(() => {
              setIsGeneratingImage(false);
            })
        : Promise.resolve();

      const audioRequest = shouldGenerateAudio
        ? postJson<{ audio: string }>("/api/user/audio-post-request", {
            menuContent: accumulatedContent,
          })
            .then((audioData) => {
              setRecipeAudio(audioData.audio);
            })
            .catch((audioError) => {
              console.error(audioError);
              toast("Audio generation failed");
            })
            .finally(() => {
              setIsGeneratingAudio(false);
            })
        : Promise.resolve();

      await Promise.all([imageRequest, audioRequest]);
      setIsBackToHomePage(true);
    } catch (error) {
      console.error("Error generating recipe:", error);
      toast("Something went wrong while building your recipe");
      setIsMenuDisplayed(false);
    } finally {
      setIsGeneratingAudio(false);
      setIsGeneratingImage(false);
    }
  };

  const handleEmailingUser = async () => {
    const validation = userInbox.safeParse({
      menuContent,
      backgroundPicture,
      recipeAudio,
    });
    if (!validation.success) {
      toast(validation.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    const response = await postJson<{ success: boolean }>(
      "/api/user/nodemailer-post-request",
      {
        menuContent,
        backgroundPicture,
        recipeAudio,
      }
    );

    if (!response.success) {
      toast("menu not sent to user's inbox");
      return;
    }

    toast("menu sent to user's inbox");
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/user/recipe-get-request");
        const data = await response.json();

        if (data.success) {
          setRecipes(data.recipes);
        } else {
          setLoadError(data.error ?? "Failed to fetch articles");
        }
      } catch (fetchError) {
        console.error(fetchError);
        setLoadError("Failed to connect to the server");
      } finally {
        setIsLoading(false);
      }
    };
    void fetchRecipes();
  }, []);

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <form className="relative min-h-[600px] w-full max-w-xl rounded-2xl bg-gray-700 p-6">
        <Card
          className={`flex min-h-[700px] items-center transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          <DietaryRequirements
            vegan={vegan}
            onVeganToggle={handleVeganToggle}
            onOtherToggle={handleDietaryRequirements}
          />
          {otherDietaryRequirements && (
            <Input
              type="text"
              onChange={handleuserOtherDietaryRequirements}
              className="w-0.25xl"
            />
          )}

          <div>{`welcome back ${sessionData?.user.name}`}</div>
          <div>{selectedCountry}</div>
          {loadError && <div className="text-sm text-red-200">{loadError}</div>}

          <div className="flex min-h-[500px] w-full items-center justify-center">
            <Map
              handleCountrySelect={handleCountrySelect}
              isDarkMode={isDarkMode}
              selectedCountry={selectedCountry}
            />
            {isMenuDisplayed && (
              <div
                className="absolute top-0 left-0 h-full w-full overflow-y-auto border-2 border-black bg-white bg-cover bg-center bg-no-repeat p-6"
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
                  className="rounded-md bg-gray-300"
                  value={menuContent}
                  rows={25}
                  cols={60}
                  readOnly
                />
                {isGeneratingImage && <SpinnerButton label="Loading Image" />}
                {isBackToHomePage && (
                  <div className="grid justify-self-center gap-2">
                    <Button
                      className="w-2xs"
                      onClick={() => {
                        handleMenuDislay();
                        setIsBackToHomePage(false);
                      }}
                    >
                      Back to home page
                    </Button>
                    <Button
                      className="w-2xs"
                      type="button"
                      onClick={handleEmailingUser}
                    >
                      send to my inbox
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSaveMenu}
                      className="w-2xs"
                    >
                      Save recipe
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <SwitchComponent
            onSwitch={handleAudioGeneration}
            onChecked={shouldGenerateAudio}
          >
            Generate Audio
          </SwitchComponent>
          <SwitchComponent
            onSwitch={handleImageGeneration}
            onChecked={shouldGenerateImage}
          >
            Generate Image
          </SwitchComponent>
          <Button asChild title={`Saved recipes: ${recipes.length}`}>
            <Link href="/recipe-ui/saved">Saved Recipe</Link>
          </Button>

          <Button type="button" onClick={handleCountrySelection}>
            Submit
          </Button>
          <Button type="button" onClick={handleSignOut}>
            Sign out
          </Button>
        </Card>
      </form>
    </main>
  );
}
