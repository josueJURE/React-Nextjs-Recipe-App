"use client";

import {
  getRetrievingRecipes,
  handleRecipeDeletion,
} from "@/lib/queries/recipes";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { DrawerScrollableContent } from "@/components/drawer";
import { AlertDialogCompoment } from "@/components/dialog";

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
            <Card key={recipe.id}>
              <CardDescription>
                {new Date(recipe.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </CardDescription>
              <CardContent>{`${recipe.content.substring(
                0,
                200
              )}...`}</CardContent>

              <DrawerScrollableContent text={recipe.content} />
              <div className="flex justify-end">
                <AlertDialogCompoment
                  onConfirm={async () => {
                    setRecipes((prev) =>
                      prev.filter((item) => item.id !== recipe.id)
                    );
                    await handleRecipeDeletion(recipe.id);
                  }}
                  trigger={
                    <button
                      type="button"
                      aria-label="Delete recipe"
                      className="cursor-pointer"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  }
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
