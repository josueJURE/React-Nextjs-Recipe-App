import { NextRequest, NextResponse } from "next/server";


import { userChoicesSchema } from "@/lib/validations/user-choices";

// Import the TYPE (used at compile-time for type checking)

import { chatCompletion} from "@/lib/chat-completions/openai"

console.log("ENV:", process.env.OPENAI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received body:", body);

    const userChoicesValidation = userChoicesSchema.safeParse(body);

    if (!userChoicesValidation.success) {
      console.error("Validation failed:", userChoicesValidation.error.issues);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: userChoicesValidation.error.issues,
        },
        { status: 400 }
      );
    }
    const { country, vegan, other } = userChoicesValidation.data;

    console.log("is other picked up", other);

    const stream = await chatCompletion(country, vegan, other)

    for await (const chunk of stream) {
      const finishReason = chunk.choices[0].finish_reason;

      if (finishReason === "stop") {
        break;
      }

      const message = chunk.choices[0]?.delta?.content || "";

      console.log(message);
    }

    return NextResponse.json({
      success: true,
      pays: country,
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
