"use client";

import { getRetrievingRecipes } from "@/lib/queries/recipes";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SavedRecipes() {
  interface Recipe {
    content: string;
    id: string
    // Add other fields of the recipe object here
  }

  const [recipes, setRecipes] = useState<{ recipes: Recipe[] } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setRecipes(await getRetrievingRecipes());
        setIsLoading(false);
      } catch (error) {
        setError(error ?? "An error has occurred");
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <p>Now loading</p>;
  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>;
  }



  if (recipes)
    return (
      <>
        {recipes.recipes.map((recipe) => {
          return (
            <Card key={recipe.id} >
              <CardContent>{recipe.content}</CardContent>
            </Card>
          );
        })}
      </>
    );
}
