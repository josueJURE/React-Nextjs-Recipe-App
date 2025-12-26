import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("Received email", body)

        return NextResponse.json({
            success: true
        }

        )
    } catch (e: any) {
        console.log(e.error)

    }

}

