import { NextRequest, NextResponse } from "next/server";

import { resetPasswordSchema } from "@/lib/validations/user-choices";

export async function PATCH(request: NextRequest) {
  try {
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

    


    ///

    console.log("newPassword", newPassword);
    console.log("confirmPassword", confirmPassword);

    return NextResponse.json({ success: true });
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
