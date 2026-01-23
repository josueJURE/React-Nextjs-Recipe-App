import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";
import {
  recipeContentSchema,
  RecipeSchema,
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

    const savedRecipe = await db.recipe.upsert({
        where: {
          userId_content: {
            userId,
            content: menuContent
          }
        },
        update: {},
        create: {
          content: menuContent,
          userId
        }
      });
      
      

    console.log("menu saved", menuContent);

    return NextResponse.json(
      {
        message: "recipe added to your favorites",
        savedRecipe
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
}
