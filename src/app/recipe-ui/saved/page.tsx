"use client";

import { useEffect, useState } from "react";

import {
  getRetrievingRecipes,
  handleRecipeDeletion,
} from "@/lib/queries/recipes";
import { ReadMore } from "@/components/ui/read-more";

export default function SavedRecipes() {
  interface Recipe {
    content: string;
    id: string;
    createdAt: string;

    // Add other fields of the recipe object here
  }

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>();

  // const [recipeID, setRecipeID] = useState<string>("")

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await getRetrievingRecipes();
        setRecipes(response.recipes);
        setIsLoading(false);
      } catch (error) {
        setError(error ?? "An error has occurred");
        setIsLoading(false);
      }
    })();
  }, []);

  const handleDeleteRecipe = async (id: string) => {
    await handleRecipeDeletion(id);
    setRecipes((currentRecipes) =>
      currentRecipes.filter((recipe) => recipe.id !== id)
    );
  };

  if (isLoading) {
    return <p>Now loading</p>;
  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>;
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 ">
      <div className="w-full max-w-xl p-6 relative bg-gray-700 rounded-2xl min-h-screen ">
        <div className="space-y-4">
          {recipes.length === 0 && <div>You have no recipe saved</div>}
          {recipes.map((recipe) => (
            <ReadMore
              key={recipe.id}
              id={recipe.id}
              text={recipe.content}
              date={recipe.createdAt}
              onDelete={handleDeleteRecipe}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
