import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RecipeUIClient from "@/components/ui/recipe-ui-client";
import prisma from "@/lib/prisma";

import type {RecipeUIProps} from "@/utils/types"



export default async function RecipeUIPage(userProps: RecipeUIProps) {
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

  // Fetch user's dietary preferences from database
  const userWithPreferences = await prisma.user.findUnique({
    where: { id: user.id },
    select: { email: true, name: true, vegan: true },
  });

  if (!userWithPreferences) {
    return redirect("/");
  }

  return <RecipeUIClient
    email={userWithPreferences.email}
    name={userWithPreferences.name}
    vegan={userWithPreferences.vegan}
  />;
}
