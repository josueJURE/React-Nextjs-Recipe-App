import { toast } from "sonner";

const headers = {
  "Content-Type": "application/json",
}


// ===============================================================================
// If method is not provided, it defaults to "GET"
// You typically don’t need "Content-Type": "application/json"
// Content-Type is mainly relevant when sending a request body (POST, PUT, PATCH)
// ===============================================================================

export const getRetrievingRecipes = async () => {
  const response = await fetch("/api/user/recipe-get-request");

  if (!response.ok) {
    const error = await response.json();
    console.error(error);

    return;
  }

  return response.json();
};


// ======================================================================
// You don’t need Content-Type
// You are not sending a body, so this header is unnecessary:
// Content-Type is only needed when you send: body: JSON.stringify(...)
// =====================================================================

export const handleRecipeDeletion = async (id: string) => {
  const response = await fetch(`/api/user/recipe-deletion?id=${id}`, {
    method: "DELETE",

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
   headers,
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
