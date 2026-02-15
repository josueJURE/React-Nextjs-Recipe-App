import { NextResponse, NextRequest } from "next/server";
import { recipeStandardUUIDv4Schema } from "@/lib/validations/user-choices";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";


export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paramID = searchParams.get("id");
  console.log("console.log id", paramID);

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

    const recipeStandardUUIDv4SchemaValidation =
      recipeStandardUUIDv4Schema.safeParse(paramID);

    if (!recipeStandardUUIDv4SchemaValidation.success) {
      return NextResponse.json(
        
        {
          message: "wrong id number",
          error: recipeStandardUUIDv4SchemaValidation.error.issues,
        },
        { status: 400 }
      );
    }

    const id = recipeStandardUUIDv4SchemaValidation.data;

    await db.recipe.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "recipe deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to  delete recipe(s)" },
      { status: 500 }
    );
  }
}
