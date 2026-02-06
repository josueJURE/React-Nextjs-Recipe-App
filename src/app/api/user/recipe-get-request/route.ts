import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { retrieveRecipeSchema } from "@/lib/validations/user-choices";
import { success } from "zod";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: User lacks credential",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const savedRecipes = await db.recipe.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "recipe retrieved",
        recipes: savedRecipes,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
