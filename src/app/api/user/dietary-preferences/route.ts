import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";
// The headers function allows you to read the HTTP incoming request headers from a Server Component.
import { headers } from "next/headers";
import { NextResponse } from "next/server";


import { userPreference } from "@/lib/validations/user-choices";
import type { UserPreference } from "@/lib/validations/user-choices";

export async function PATCH(request: Request) {


  try {
    // Get the authenticated session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log("session", session);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const userPreferencesValidation = userPreference.safeParse(body);


    if (!userPreferencesValidation.success) {
      return NextResponse.json(
        { error: "Invalid vegan value. Must be a boolean." },
        { status: 400 }
      );
    }
    const validatedData: UserPreference = userPreferencesValidation.data;
    const { vegan } = validatedData;

    const updatedUserResult = await sql<{ userId: string; vegan: boolean }>(
      `INSERT INTO "user_preferences" ("userId", "vegan")
       VALUES ($1, $2)
       ON CONFLICT ("userId")
       DO UPDATE SET "vegan" = EXCLUDED."vegan"
       RETURNING "userId", "vegan"`,
      [userId, vegan]
    );
    const updatedUser = updatedUserResult.rows[0];

    return NextResponse.json({
      success: true,
      vegan: updatedUser.vegan,
    });
  } catch (error) {
    console.error("Error updating dietary preferences:", error);
    return NextResponse.json(
      { error: "Failed to update dietary preferences" },
      { status: 500 }
    );
  }
}

