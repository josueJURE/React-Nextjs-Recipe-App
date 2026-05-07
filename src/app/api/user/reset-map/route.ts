import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";
// The headers function allows you to read the HTTP incoming request headers from a Server Component.
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { emptySelectedCountryArray } from "@/lib/validations/user-choices";
import type { EmptySelectedCountryArray } from "@/lib/validations/user-choices";

export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log("session", session);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const emptySelectedCountryArrayValidation =
      emptySelectedCountryArray.safeParse(body);

    if (!emptySelectedCountryArrayValidation.success) {
      return NextResponse.json(
        { error: "Couldn't empty the array" },
        { status: 400 }
      );
    }

    const validatedData: EmptySelectedCountryArray =
      emptySelectedCountryArrayValidation.data;
    const { selectedCountry } = validatedData;

    const updatedUserResult = await sql<{ selectedCountries: string[] }>(
      `
      UPDATE "user"
      SET
        "selectedCountries" = $1::TEXT[],
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = $2
      RETURNING "selectedCountries"
      `,
      [[], userId]
    );

    if (updatedUserResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      selectedCountries: updatedUserResult.rows[0].selectedCountries,
    });
  } catch (error) {
    console.error("Something has gone wrong", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset map" },
      { status: 500 }
    );
  }
}
