"use client";

// #Gladiator2000

import Map from "@/components/map";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { userInbox } from "@/lib/validations/user-choices";
import { SwitchComponent } from "@/components/switchComponent";
import { SpinnerButton } from "./spinnerButton";
import postJson from "@/lib/fetchFunction/fetchFunction";
import { countrySchema } from "@/lib/validations/user-choices";

import WavesurferPlayer from "@wavesurfer/react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import DietaryRequirements from "@/components/ui/dietary-requirements";
import { Input } from "@/components/ui/input";
import type { RecipeUIProps } from "@/utils/types";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export default function RecipeUIClient(userProps: RecipeUIProps) {
  const router = useRouter();

  const handleSignOut = () => {
    router.push("/sign-in");
  };

  ///// wave surfer
  const [wavesurfer, setWavesurfer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onReady = (ws: any) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  const onSkipForward = () => {
    if (wavesurfer) {
      const currentTime = wavesurfer.getCurrentTime();
      wavesurfer.setTime(currentTime + 10); // Skip forward 10 seconds
    }
  };

  const onSkipBack = () => {
    if (wavesurfer) {
      const currentTime = wavesurfer.getCurrentTime();
      wavesurfer.setTime(Math.max(0, currentTime - 10)); // Skip back 10 seconds
    }
  };

  ///// wave surfer

  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isMenuDisplayed, setIsMenuDisplayed] = useState<boolean>(false);

  const [menuContent, setMenuContent] = useState<string>("");

  const [isBackToHomePage, setIsBackToHomePage] = useState<boolean>(false);

  const [isAudioGenerated, setIsAudioGenerated] = useState<boolean>(false);

  // const [isDisplaySinner, setIsDisplaySinner] = useState<boolean>(false);

  const [isImageGenerated, setIsImageGenerated] = useState<boolean>(false);
  const [backgroundPicture, setIsBckgroundPicture] = useState<string>("");

  const [vegan, setVegan] = useState<boolean>(userProps.vegan);

  const [otherDietaryRequirements, setOtherDietaryRequirements] =
    useState<boolean>(false);

  const [userOtherDietaryRequirements, setuserOtherDietaryRequirements] =
    useState<string>("");

  const handleVeganToggle = (onChecked: boolean) => {
    setVegan(onChecked);
  };

  const handleAudioGeneration = () => {
    setIsAudioGenerated((onChecked) => !onChecked);
  };

  const handleImageGeneration = async () => {
    setIsImageGenerated((onChecked) => !onChecked);
  };

  const handleDietaryRequirements = (onChecked: boolean) => {
    setOtherDietaryRequirements(onChecked);
  };

  const handleCountrySelect = (countryName: string) => {
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

  const [recipeAudio, setRecipeAudio] = useState<string | null>(null);

  console.log("isAudioGenerated", isAudioGenerated);

  console.log("isImageGenerated", isImageGenerated);

  const handleCountrySelection = async (e: React.FormEvent) => {
    e.preventDefault(); // <-- REQUIRED: else would lead to SyntaxError: Unexpected end of JSON input on backend

    const countrySchemaValidation = countrySchema.safeParse(selectedCountry);

    if (!countrySchemaValidation.success) {
      toast(
        `${countrySchemaValidation.error.issues[0]?.message ?? "Invalid input"}`
      );
      throw new Error(" select a country");
    }

    const response = await fetch("/api/user/country-post-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: selectedCountry,
        vegan: vegan,
        other: userOtherDietaryRequirements,
        isImageGenerated,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(
        `Failed to update preference: ${JSON.stringify(errorData)}`
      );
    }

    if (response.ok) {
      setIsMenuDisplayed(true);
      setMenuContent("");

      // Create a local variable to accumulate the complete recipe
      let accumulatedContent = "";

      // Read the stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              console.log("value", value);
              setIsBackToHomePage(true);
              if (isImageGenerated) {
                const imageData = await postJson<{ backGroundPicture: string }>(
                  "/api/user/image-post-request",
                  { menuContent: accumulatedContent, backgroundPicture }
                );

                setIsBckgroundPicture(imageData.backGroundPicture);
                console.log(" backgroundPicture", typeof backgroundPicture);
                backgroundPicture;
              }
              if (isAudioGenerated) {
                if (isAudioGenerated) {
                  const audioData = await postJson<{ audio: string }>(
                    "/api/user/audio-post-request",
                    { menuContent: accumulatedContent }
                  );

                  setRecipeAudio(audioData.audio);
                  console.log("recipeAudio", typeof recipeAudio);
                }
              }

              break;
            }

            const text = decoder.decode(value, { stream: true });
            accumulatedContent += text; // ✅ Accumulate in local variable
            setMenuContent((prev) => prev + text);
          }
        } catch (error) {
          console.error("Error reading stream:", error);
        }
      }
    }
  };

  const handleEmailingUser = async () => {
    const validation = userInbox.safeParse({
      menuContent,
      backgroundPicture,
      recipeAudio,
    });
    if (!validation.success) {
      toast(`${validation.error.message[0]}`);
      return;
    }
    const response: Response = await postJson(
      "/api/user/nodemailer-post-request",
      {
        menuContent,
        backgroundPicture,
        recipeAudio,
      }
    );

    if (!response.ok) {
      toast("menu not sent to user's inbox");
    }

    toast("menu send to user's inbox");
  };

  // Wait for hydration to complete
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <main className="min-h-screen w-full flex items-center justify-center p-4">
        <form className="w-full max-w-xl p-6 relative bg-gray-700 rounded-2xl min-h-[600px]">
          <Card
            className={`flex items-center min-h-[700px] transition-opacity duration-300 ${
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

            <div>{`welcome back ${userProps.name}`}</div>
            <div>{selectedCountry}</div>

            <div className="min-h-[500px] w-full flex items-center justify-center">
              <Map
                handleCountrySelect={handleCountrySelect}
                isDarkMode={isDarkMode}
              />
              {isMenuDisplayed && (
                <div
                  className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-95 p-6 overflow-y-auto  border-black border-2  bg-no-repeat bg-cover bg-center "
                  style={{
                 
                    backgroundImage: backgroundPicture
                      ? `url(${backgroundPicture})`
                      : undefined,
                  }}
                >
                  {isImageGenerated && <SpinnerButton></SpinnerButton>}
                  {recipeAudio && (
                    <div className="border-black border-2 bg-white/80 rounded-lg p-4 mb-4">
                      <WavesurferPlayer
                        height={80}
                        waveColor="rgb(139, 92, 246)"
                        progressColor="rgb(109, 40, 217)"
                        url={recipeAudio}
                        onReady={onReady}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      <div className="flex items-center justify-center gap-4 mt-4">
                        <Button
                          type="button"
                          onClick={onSkipBack}
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                        >
                          <SkipBack className="h-5 w-5" />
                        </Button>
                        <Button
                          type="button"
                          onClick={onPlayPause}
                          size="icon"
                          className="h-12 w-12"
                        >
                          {isPlaying ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          onClick={onSkipForward}
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                        >
                          <SkipForward className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  )}
                  <textarea
                    className="bg-gray-300 rounded-md"
                    value={menuContent}
                    rows={25}
                    cols={60}
                    readOnly
                  ></textarea>{" "}
                  {isBackToHomePage && (
                    <Button
                      onClick={() => {
                        handleMenuDislay();
                        setIsBackToHomePage(false);
                      }}
                    >
                      Back to home page
                    </Button>
                  )}
                  {isBackToHomePage && (
                    <Button type="button" onClick={handleEmailingUser}>
                      send to my inbox
                    </Button>
                  )}
                </div>
              )}
            </div>

            <SwitchComponent
              onSwitch={handleAudioGeneration}
              onChecked={isAudioGenerated}
            >
              Generate Audio
            </SwitchComponent>
            <SwitchComponent
              onSwitch={handleImageGeneration}
              onChecked={isImageGenerated}
            >
              Generate Image
            </SwitchComponent>

            <Button onClick={handleCountrySelection}>Submit</Button>
            <Button type="button" onClick={handleSignOut}>
              Sign out
            </Button>
          </Card>
        </form>
      </main>
      {/* </Suspense> */}
    </>
  );
}
