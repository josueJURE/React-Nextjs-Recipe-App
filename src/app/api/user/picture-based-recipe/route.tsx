import { NextRequest, NextResponse } from "next/server";

import { imageToText } from "@/lib/chat-completions/openai";
import { textToImageSchema } from "@/lib/validations/user-choices";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(
      "picture payload size",
      typeof body?.image === "string" ? body.image.length : 0
    );

    const userImageToTextValidation = textToImageSchema.safeParse(body);

    if (!userImageToTextValidation.success) {
      return NextResponse.json(
        {
          message: "We couldn't process the image",
          error: userImageToTextValidation.error.issues,
        },
        { status: 400 }
      );
    }

    const isProduction = process.env.NODE_ENV === "production";

    if (!isProduction) {
      // Development: Use a mock description to save OpenAI API tokens
      const description =
        "Mock description: I can see a few ingredients on a kitchen surface.";

      return NextResponse.json({ description }, { status: 200 });
    } else {
      // Production: Use actual OpenAI API
      const stream = await imageToText(userImageToTextValidation.data.image);
      let description = "";

      for await (const chunk of stream) {
        description += chunk.choices[0]?.delta?.content ?? "";
      }

      return NextResponse.json({ description }, { status: 200 });
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
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
