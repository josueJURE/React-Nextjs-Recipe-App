"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChefHat } from "lucide-react";
import { toast } from "sonner";
import { MenuPreview } from "./menu-preview";

import Map from "@/components/map";
import { SwitchComponent } from "@/components/switchComponent";
import { signOut, useSession } from "@/lib/auth-client";
import postJson from "@/lib/fetchFunction/fetchFunction";
import {
  handleCountrySelectionResponse,
  handleSavedMenuResponse,
} from "@/lib/queries/recipes";
import {
  countrySchema,
  recipeContentSchema,
  userInbox,
} from "@/lib/validations/user-choices";
import type { RecipeUIProps } from "@/utils/types";
import {
  appSectionClassName,
  appShellClassName,
  bodyTextClassName,
  cardClassName,
  cardContentClassName,
  cardDescriptionClassName,
  cardHeaderClassName,
  cardTitleClassName,
  fieldLabelClassName,
  heroContainerClassName,
  heroIconContainerClassName,
  infoPanelClassName,
  inputClassName,
  primaryButtonClassName,
  primaryButtonStyle,
  sectionHeadingClassName,
  themeColor,
} from "@/utils/const";

import { retrieveUserFirstName } from "@/utils/helper-functions/helper-functions";

import DietaryRequirements from "@/components/ui/dietary-requirements";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RecipeUIClient(userProps: RecipeUIProps) {
  const router = useRouter();
  const { data: sessionData } = useSession();

  console.log("sessionData", typeof sessionData?.user.name);

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [recipes, setRecipes] = useState<unknown[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMenuDisplayed, setIsMenuDisplayed] = useState<boolean>(false);
  const [menuContent, setMenuContent] = useState<string>("");
  const [isBackToHomePage, setIsBackToHomePage] = useState<boolean>(false);
  const [shouldGenerateAudio, setShouldGenerateAudio] = useState<boolean>(true);
  const [shouldGenerateImage, setShouldGenerateImage] = useState<boolean>(true);
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

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

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

  const menuPreviewState = {
    isMenuDisplayed,
    isGeneratingAudio,
    isGeneratingImage,
    isBackToHomePage,
    backgroundPicture,
    recipeAudio,
    menuContent,
  };

  const menuPreviewActions = {
    handleMenuDislay,
    setIsBackToHomePage,
    handleEmailingUser,
    handleSaveMenu,
  };

  return (
    <section className={appSectionClassName}>
      <div className={appShellClassName}>
        <div className={heroContainerClassName}>
          <div className={heroIconContainerClassName}>
            <ChefHat
              className="size-12 sm:size-14"
              style={{ color: themeColor }}
              strokeWidth={2.4}
            />
          </div>
          {!isMenuDisplayed && (
            <div className="space-y-4">
              {/* <h1 className={heroTitleClassName}>Culinary Explorer</h1> */}
              <p className={cardTitleClassName}>
                Welcome back{" "}
                {retrieveUserFirstName(sessionData?.user.name) ??
                  userProps.name}
              </p>
            </div>
          )}
        </div>

        {!isMenuDisplayed && (
          <Card className={`${cardClassName} max-w-5xl`}>
            <CardHeader className={cardHeaderClassName}>
              <CardTitle className={`${cardTitleClassName} text-nowrap`}>
                Build your next menu
              </CardTitle>
              <CardDescription className={cardDescriptionClassName}>
                Choose a country, set dietary preferences, and generate a recipe
                with optional audio and imagery.
              </CardDescription>
            </CardHeader>

            <CardContent className={`${cardContentClassName} space-y-8 `}>
              {loadError && (
                <div className="rounded-[1.35rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {loadError}
                </div>
              )}

              <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <div className="space-y-6">
                  <div className={infoPanelClassName}>
                    {!selectedCountry ? (
                      <>
                        <h2 className={sectionHeadingClassName}>
                          Pick a country
                        </h2>
                        <p className={`${bodyTextClassName} pt-2`}>
                          Select a cuisine region to tailor the recipe
                          generation.
                        </p>
                      </>
                    ) : (
                      <p className={sectionHeadingClassName}>
                        {`You picked ${selectedCountry}`}
                      </p>
                    )}

                    <div className="mt-5 overflow-x-auto rounded-[1.35rem] border border-[#efe5dc] bg-white p-4">
                      <div className="flex min-w-[500px] justify-center">
                        <Map
                          handleCountrySelect={handleCountrySelect}
                          isDarkMode={isDarkMode}
                          selectedCountry={selectedCountry}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={infoPanelClassName}>
                    <DietaryRequirements
                      vegan={vegan}
                      otherChecked={otherDietaryRequirements}
                      onVeganToggle={handleVeganToggle}
                      onOtherToggle={handleDietaryRequirements}
                    />

                    {otherDietaryRequirements && (
                      <div className="space-y-3 pt-5">
                        <label
                          className={fieldLabelClassName}
                          htmlFor="other-dietary-requirements"
                        >
                          Other dietary requirements
                        </label>
                        <Input
                          id="other-dietary-requirements"
                          type="text"
                          onChange={handleuserOtherDietaryRequirements}
                          placeholder="Allergies, ingredients to avoid, or serving notes"
                          className={inputClassName}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className={infoPanelClassName}>
                    <h2 className={sectionHeadingClassName}>
                      Generation options
                    </h2>
                    <p className={`${bodyTextClassName} pt-2`}>
                      Decide whether to create audio narration or an image for
                      the generated recipe.
                    </p>

                    <div className="space-y-3 pt-5">
                      <SwitchComponent
                        style={{ backgroundColor: themeColor }}
                        onSwitch={handleAudioGeneration}
                        onChecked={shouldGenerateAudio}
                      >
                        Generate Audio
                      </SwitchComponent>
                      <SwitchComponent
                        style={{ backgroundColor: themeColor }}
                        onSwitch={handleImageGeneration}
                        onChecked={shouldGenerateImage}
                      >
                        Generate Image
                      </SwitchComponent>
                    </div>
                  </div>

                  <div className={infoPanelClassName}>
                    <h2 className={sectionHeadingClassName}>Actions</h2>
                    <p className={`${bodyTextClassName} pt-2`}>
                      Generate a new recipe, revisit saved menus, or sign out.
                    </p>

                    <div className="space-y-3 pt-5">
                      <Button
                        className={primaryButtonClassName}
                        type="button"
                        onClick={handleCountrySelection}
                        style={primaryButtonStyle}
                        disabled={isGeneratingAudio || isGeneratingImage}
                      >
                        Generate Recipe
                      </Button>

                      <Button
                        asChild
                        title={
                          isLoading
                            ? "Loading saved recipes"
                            : `Saved recipes: ${recipes.length}`
                        }
                        style={primaryButtonStyle}
                        className={primaryButtonClassName}
                      >
                        <Link href="/recipe-ui/saved">Saved Recipes</Link>
                      </Button>

                      <Button
                        className={primaryButtonClassName}
                        type="button"
                        onClick={handleSignOut}
                        style={primaryButtonStyle}
                      >
                        Sign out
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isMenuDisplayed && (
         
            <MenuPreview 
              preview={menuPreviewState}
              actions={menuPreviewActions}
            />
     
        )}
      </div>
    </section>
  );
}
