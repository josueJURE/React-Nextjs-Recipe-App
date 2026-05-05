import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
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
    const selectedCountriesResult = await sql(
      `SELECT "selectedCountries"
       FROM "user"
       WHERE "id" = $1
       ORDER BY "createdAt" DESC`,
      [userId]
    );
    const savedSelectedCountries = selectedCountriesResult.rows

    

    /*
    const selectedCountriesResult = await sql(
      `SELECT "selectedCountries"
       FROM "user"
       WHERE "id" = $1
       ORDER BY "createdAt" DESC`,
      [userId]
    );
    const savedSelectedCountries = selectedCountriesResult.rows
  

    return NextResponse.json(
      {
        success: true,
        message: "recipe retrieved",
        recipes: savedRecipes,
        selectedCountries: savedSelectedCountries
      },
      { status: 200 }
    );

  //use : const [arraySelectedCountries, setArraySelectedCountries] = useState<unknown[]>([]); in recipe-ui-client.tsx file



*/
    

    const savedRecipesResult = await sql(
      `SELECT "id", "title", "content", "imageUrl", "audioUrl", "userId", "createdAt", "updatedAt"
       FROM "recipe"
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC`,
      [userId]
    );
    const savedRecipes = savedRecipesResult.rows;


    return NextResponse.json(
      {
        success: true,
        message: "recipe retrieved",
        recipes: savedRecipes,
        savedSelectedCountries: savedSelectedCountries[0].selectedCountries
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
