import { NextRequest, NextResponse } from "next/server"

import { imageGeneration } from "@/lib/chat-completions/openai";

export async function POST(request: NextRequest) {
    const body = await request.json()

    const { menuContent } = body
    console.log("menuContentz", menuContent)

    const openAIimage = await imageGeneration(menuContent)

    console.log(openAIimage)


    return NextResponse.json({
        status: 200,
        backGroundPicture: openAIimage

 
    })
}