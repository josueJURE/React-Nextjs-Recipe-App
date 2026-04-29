import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";
import {
  recipeContentSchema,
} from "@/lib/validations/user-choices";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized: User lacks valid authentication credentials",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("body", body);
    const recipeContentSchemaValidation = recipeContentSchema.safeParse(body);

    if (!recipeContentSchemaValidation.success) {
      return NextResponse.json(
        {
          error: recipeContentSchemaValidation.error.issues,
        },
        { status: 400 }
      );
    }

    const menuContent = recipeContentSchemaValidation.data;

    const userId = session.user.id

    const savedRecipeResult = await sql(
      `INSERT INTO "recipe" ("id", "content", "userId", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT ("userId", "content")
       DO UPDATE SET "updatedAt" = "recipe"."updatedAt"
       RETURNING "id", "title", "content", "imageUrl", "audioUrl", "userId", "createdAt", "updatedAt"`,
      [menuContent, userId]
    );
    const savedRecipe = savedRecipeResult.rows[0];
      
      

    console.log("menu saved", menuContent);

    return NextResponse.json(
      {
        message: "recipe added to your favorites",
        savedRecipe
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving recipe:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
}
