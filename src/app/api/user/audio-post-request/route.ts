import { NextRequest, NextResponse } from "next/server";

import { menuContentForImageSchema } from "@/lib/validations/user-choices";
import { audioGeneration } from "@/lib/chat-completions/openai";

export async function POST(request: NextRequest) {

    try {
        const body = await request.json();

        const menuContentForAudioSchemaValidation =
          menuContentForImageSchema.safeParse(body);
      
        if (!menuContentForAudioSchemaValidation.success) {
          return NextResponse.json(
            {
              error: menuContentForAudioSchemaValidation.error.issues,
            },
            { status: 400 }
          );
        }
      
        const { menuContent } = menuContentForAudioSchemaValidation.data;
      
        const audio = await audioGeneration(menuContent);
      
        return NextResponse.json(
          {
            audio,
          },
          {
            status: 200,
          }
        );

    } catch(error) {
        console.error("Audio API error:", error);
        return NextResponse.json({
            error: "API Crashed"
        }, {
            status: 500
        })
    }

}
