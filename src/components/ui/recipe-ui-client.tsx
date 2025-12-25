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

    const data = await response.json();

    console.log(data.pays);
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
