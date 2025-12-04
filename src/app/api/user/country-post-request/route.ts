import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

console.log("ENV:", process.env.OPENAI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { country } = body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("openai", openai);

    const stream = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: ` make me a dish from ${country}`,
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

        console.log(message)
        // const messageJSON = JSON.stringify({ message });
        // res.write(`data: ${messageJSON}\n\n`);
        // getStreamRecipe(message);
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
