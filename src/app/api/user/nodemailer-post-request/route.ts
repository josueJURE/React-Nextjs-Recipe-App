import { NextRequest, NextResponse } from "next/server";
import processEmail from '@/lib/nodemailer/nodemailer'




export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("Received email", body.email)

        processEmail(body.email)

        return NextResponse.json({
            success: true
        }

        )
    } catch (e: any) {
        console.log(e.error)

    }

}

