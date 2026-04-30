import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RecipeUIClient from "@/components/ui/recipe-ui-client";
import { sql } from "@/lib/db";

export default async function RecipeUIPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // console.log("=== SESSION DEBUG ===");
  // console.log("Full session:", JSON.stringify(session, null, 2));
  // console.log("=== SESSION DEBUG END ===");

  if (!session) {
    return redirect("/");
  }

  const user = session.user;

  // console.log("Full user object:", JSON.stringify(user, null, 2));
  // console.log("user.name:", user?.name);

  const recipeAppUserResult = await sql<{ email: string; name: string }>(
    'SELECT "email", "name" FROM "user" WHERE "id" = $1 LIMIT 1',
    [user.id]
  );

  const recipeAppUserPreferencesResult = await sql<{ vegan: boolean }>(
    'SELECT "vegan" FROM "user_preferences" WHERE "userId" = $1 LIMIT 1',
    [user.id]
  );

  const recipeAppUser = recipeAppUserResult.rows[0];
  const recipeAppUserPreferences = recipeAppUserPreferencesResult.rows[0];

  if (!recipeAppUser && !recipeAppUserPreferences) {
    return redirect("/");
  }

  if (!recipeAppUser) {
    return redirect("/");
  }

  return <RecipeUIClient
  
    email={recipeAppUser.email}
    name={recipeAppUser.name}
    vegan={recipeAppUserPreferences?.vegan || false}
  />;
}
