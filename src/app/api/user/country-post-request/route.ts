import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import {userChoicesSchema} from  '@/lib/validations/user-choices'

console.log("ENV:", process.env.OPENAI_API_KEY);



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userChoicesValidation = userChoicesSchema.safeParse(body);

    if (!userChoicesValidation.success) {
      return NextResponse.json({
        success: false,
        error: "Invalid request data",
        details: userChoicesValidation.error.issues,
      }, {status: 400}
    );
    }
    const { country, vegan } = userChoicesValidation.data;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("openai", openai);

    console.log("is user vegan", vegan);

    const stream = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `make me a dish from ${country}${vegan ? ', taking into account that the user is vegan' : ''}`

        },
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 2000,
      stream: true,
    });

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
    console.log(error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
