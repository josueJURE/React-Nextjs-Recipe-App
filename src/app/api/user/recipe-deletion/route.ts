import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";

export async function DELETE(request: NextRequest) {

  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get("id")
  console.log("console.log id", id)


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

 

   await db.recipe.delete({
      where: {
        id: id || undefined,
      }
    })

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
