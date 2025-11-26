"use client";

// #Gladiator2000

import Map from "@/components/map";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";



export default function Test() {

  const [selectedCountry,  setSelectedCountry] = useState<string>("")

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  





  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
  };



  return (
    <>
      <main className="min-h-screen w-full flex items-center justify-center p-4">
        <form className="w-full max-w-xl p-6 relative bg-gray-700 rounded-2xl">
          <Card>
            <Map
              handleCountrySelect={handleCountrySelect}
              isDarkMode={isDarkMode}
            />
          </Card>
        </form>
      </main>
    </>
  );
}
