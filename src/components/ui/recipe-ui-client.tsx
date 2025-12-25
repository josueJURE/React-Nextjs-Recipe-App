"use client";

// #Gladiator2000

import Map from "@/components/map";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

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
import { Suspense } from "react";

export default function RecipeUIClient(userProps: RecipeUIProps) {
  const router = useRouter();

  const handleSignOut = () => {
    router.push("/sign-in");
  };
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(true);

  const [isMenuDisplayed, setIsMenuDisplayed ] = useState<boolean>(false);

  const [menuContent, setMenuContent] = useState<string>("");

  const [vegan, setVegan] = useState<boolean>(userProps.vegan);

  const [otherDietaryRequirements, setOtherDietaryRequirements] =
    useState<boolean>(false);

  const [userOtherDietaryRequirements, setuserOtherDietaryRequirements] =
    useState<string>("");

  const handleVeganToggle = (checked: boolean) => {
    setVegan(checked);
  };

  const handleDietaryRequirements = (checked: boolean) => {
    setOtherDietaryRequirements(checked);
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
    setIsMenuDisplayed(prev => !prev)
  }

  const handleCountrySelection = async (e: React.FormEvent) => {
    e.preventDefault(); // <-- REQUIRED: else would lead to SyntaxError: Unexpected end of JSON input on backend

    const response = await fetch("/api/user/country-post-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: selectedCountry,
        vegan: vegan,
        other: userOtherDietaryRequirements,
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
      setMenuContent(""); // Reset content before streaming

      // Read the stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            const text = decoder.decode(value, { stream: true });
            setMenuContent((prev) => prev + text);
          }
        } catch (error) {
          console.error("Error reading stream:", error);
        }
      }
    }
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
                  <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-95 p-6 overflow-y-auto  border-black border-2 rounded-md">
                    <div className="prose max-w-none ">
                      <h2 className="text-2xl font-bold mb-4">Your Recipe</h2>
                      <div className="whitespace-pre-wrap">{menuContent}</div>
                    </div>
                    <Button onClick={handleMenuDislay}>Back to home page</Button>
                  </div>
                )}
              </div>
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
