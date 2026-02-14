import { toast } from "sonner";

// export const getRetrievingRecipes = async () => {
//   const response = await fetch("/api/user/recipe-get-request");
//   if (response.ok) {
//     const recipe = await response.json();
//     console.log("recipe", recipe);
//     return recipe;
//   } else {
//     const error = await response.json();
//     console.error(error);
//   }
// };

export const getRetrievingRecipes = async () => {
  const response = await fetch("/api/user/recipe-get-request");

  if (!response.ok) {
    const error = await response.json();
    console.error(error);

    return;
  }

  return response.json();
};

export const handleRecipeDeletion = async (id: string) => {
  const response = await fetch(`/api/user/recipe-deletion?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    // toast("recipe couldn't be deleted")
    throw new Error("something has gone wrong");
  }
  console.log("delete");
};

export const handleSavedMenuResponse = async (menuContent: string) => {
  const response = await fetch("/api/user/save-recipe-request", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuContent),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error response:", errorData);
    toast("we couln't save this menu to your database");
    return;
  }

  toast("menu saved to your db");
};
