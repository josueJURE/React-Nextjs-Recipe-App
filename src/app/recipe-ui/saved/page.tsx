"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookmarkCheck } from "lucide-react";

import {
  getRetrievingRecipes,
  handleRecipeDeletion,
} from "@/lib/queries/recipes";
import { ReadMore } from "@/components/ui/read-more";
import { Button } from "@/components/ui/button";
import {
  appSectionClassName,
  appShellClassName,
  bodyTextClassName,
  cardClassName,
  cardContentClassName,
  cardDescriptionClassName,
  cardHeaderClassName,
  cardTitleClassName,
  heroIconContainerClassName,
  primaryButtonStyle,
  secondaryButtonClassName,
  themeColor,
} from "@/utils/const";

export default function SavedRecipes() {
  interface Recipe {
    content: string;
    id: string;
    createdAt: string;

    // Add other fields of the recipe object here
  }

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>()


  // const [recipeID, setRecipeID] = useState<string>("")

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await getRetrievingRecipes();
        setRecipes(response.recipes);
        setIsLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error has occured");
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

  return (
    <main className={`${appSectionClassName} h-screen`}>
      <div className={appShellClassName}>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className={heroIconContainerClassName}>
            <BookmarkCheck
              className="size-12 sm:size-14"
              style={{ color: themeColor }}
              strokeWidth={2.4}
            />
          </div>

          <div className="space-y-3">
            <h1 className={cardTitleClassName}>Saved Recipes</h1>
            <p className={cardDescriptionClassName}>
              Revisit your favorite generated menus whenever inspiration calls.
            </p>
          </div>
        </div>

        <section className={`${cardClassName} max-w-5xl`}>
          <div className={`${cardHeaderClassName} flex flex-col gap-5`}>
            <Button
              asChild
              variant="outline"
              className={`${secondaryButtonClassName} max-w-fit px-5`}
            >
              <Link href="/recipe-ui">
                <ArrowLeft className="size-4" />
                Back to generator
              </Link>
            </Button>
          </div>

          <div className={`${cardContentClassName} space-y-5`}>
            {isLoading && (
              <div className="rounded-[1.35rem] border border-[#efe5dc] bg-[#fcf6f0] px-5 py-6 text-center">
                <p className={bodyTextClassName}>Loading saved recipes...</p>
              </div>
            )}

            {error && (
              <div className="rounded-[1.35rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {!isLoading && !error && recipes.length === 0 && (
              <div className="rounded-[1.35rem] border border-[#efe5dc] bg-[#fcf6f0] px-5 py-8 text-center">
                <h2 className="font-serif text-2xl font-semibold text-[#2f1d17]">
                  No saved recipes yet
                </h2>
                <p className={`${bodyTextClassName} mt-2`}>
                  Generate a menu, save it, and it will appear here.
                </p>
                <Button
                  asChild
                  className="mt-6 h-13 rounded-[1.2rem] px-6 text-base font-semibold text-white shadow-none hover:bg-[#b24c24]"
                  style={primaryButtonStyle}
                >
                  <Link href="/recipe-ui">Create a recipe</Link>
                </Button>
              </div>
            )}

            {!isLoading && !error && (
              <div className="grid gap-4">
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
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
