import { NextRequest, NextResponse } from "next/server";

import { imageGeneration } from "@/lib/chat-completions/openai";

import { menuContentForImageSchema } from "@/lib/validations/user-choices";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const menuContentOPENAIValidation =
      menuContentForImageSchema.safeParse(body);

    if (!menuContentOPENAIValidation.success) {
      return NextResponse.json(
        {
          message: "recipe was sent in the wrong format",
          error: menuContentOPENAIValidation.error.issues,
        },
        { status: 400 }
      );
    }

    const { menuContent } = menuContentOPENAIValidation.data;
    console.log("menuContentz", menuContent);

    const openAIimage = await imageGeneration(menuContent);

    console.log(openAIimage);

    return NextResponse.json(
      {
        backGroundPicture: openAIimage,
      },

      { status: 200 }
    );
  } catch (error) {
    console.error("Image generation failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate image",
      },
      { status: 500 }
    );
  }
}
