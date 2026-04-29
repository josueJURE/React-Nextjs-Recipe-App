import { NextRequest, NextResponse } from "next/server";

import { resetPasswordSchema } from "@/lib/validations/user-choices";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { sql } from "@/lib/db";

export async function PATCH(request: NextRequest) {
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
    console.log("Received body:", body);

    const resetPasswordSchemaValidation = resetPasswordSchema.safeParse(body);

    if (!resetPasswordSchemaValidation.success) {
      return NextResponse.json(
        {
          success: false,
          message: resetPasswordSchemaValidation.error.message,
        },
        { status: 400 }
      );
    }

    const { newPassword, confirmPassword } = resetPasswordSchemaValidation.data;

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const updatedUserPassword = await sql(
      'UPDATE "account" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "userId" = $1',
      [userId]
    );

    return NextResponse.json({
      success: true,
      updatedAccounts: updatedUserPassword.rowCount,
    });
  } catch (error) {
    console.error("Error in PATCH handler:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
