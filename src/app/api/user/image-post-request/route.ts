import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

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

    const isProduction = process.env.NODE_ENV === "production";
    let openAIimage: string | null | undefined;

    if (!isProduction) {
      // Development: Use mock image to save API tokens
      try {
        const mockImagePath = join(process.cwd(), "assets", "mock-image.jpeg");
        const imageBuffer = await readFile(mockImagePath);
        const base64Image = imageBuffer.toString("base64");
        openAIimage = `data:image/jpeg;base64,${base64Image}`;
        console.log("Using mock image for development");
      } catch (error) {
        console.error("Failed to read mock image:", error);
        // Fallback to API if mock image is not available
        openAIimage = await imageGeneration(menuContent);
      }
    } else {
      // Production: Use actual OpenAI API
      openAIimage = await imageGeneration(menuContent);
    }

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
