import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RecipeUIClient from "@/components/ui/recipe-ui-client";
import { sql } from "@/lib/db";



async function RecipePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("=== SESSION DEBUG ===");
  console.log("Full session:", JSON.stringify(session, null, 2));
  console.log("=== SESSION DEBUG END ===");

  if (!session) {
    return redirect("/");
  }

  const user = session?.user;



  console.log("Full user object:", JSON.stringify(user, null, 2));
  console.log("user.name:", user?.name);

  const userWithPreferencesResult = await sql<{
    email: string;
    name: string;
    vegan: boolean | null;
  }>(
    `SELECT u."email", u."name", up."vegan"
     FROM "user" u
     LEFT JOIN "user_preferences" up ON up."userId" = u."id"
     WHERE u."id" = $1
     LIMIT 1`,
    [user.id]
  );

  const userWithPreferences = userWithPreferencesResult.rows[0];

  if (!userWithPreferences) {
    return redirect("/");
  }

  return <RecipeUIClient
    email={userWithPreferences.email}
    name={userWithPreferences.name}
    vegan={userWithPreferences.vegan ?? false}
  />;
}

export default RecipePage
