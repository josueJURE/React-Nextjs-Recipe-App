import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RecipeUIClient from "@/components/ui/recipe-ui-client";

import type {RecipeUIProps} from "@/utils/types"



export default async function RecipeUIPage(userProps: RecipeUIProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("=== SESSION DEBUG ===");
  console.log("Full session:", JSON.stringify(session, null, 2));
  console.log("=== SESSION DEBUG END ===");

  if (!session) {
    return redirect("/");
  }

  const user = session.user;

  console.log("Full user object:", JSON.stringify(user, null, 2));
  console.log("user.name:", user?.name);

  return <RecipeUIClient email={user.email} name={user.name} />;
}
