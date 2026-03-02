"use client";

import {
  fetchRecipes,
  handleRecipeDeletion,
} from "@/lib/queries/recipes";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { DrawerScrollableContent } from "@/components/drawer";
import { AlertDialogCompoment } from "@/components/dialog";

export default function SavedRecipes() {
  interface Recipe {
    content: string;
    id: string;
    createdAt: string;
  }

  const queryClient = useQueryClient();
  const { isError, isPending, data = [], error } = useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: fetchRecipes,
  });

  if (isPending) {
    return <p>Now loading</p>;
  }

  if (isError) {
    return <p>{(error as Error)?.message ?? "Failed to load recipes"}</p>;
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 ">
      <div className="w-full max-w-xl p-6 relative bg-gray-700 rounded-2xl min-h-screen ">
        <div className="space-y-4">
          {data.length === 0 && <div>You have no recipe saved</div>}
          {data.map((recipe) => (
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
                    await handleRecipeDeletion(recipe.id);
                    await queryClient.invalidateQueries({ queryKey: ["recipes"] });
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
