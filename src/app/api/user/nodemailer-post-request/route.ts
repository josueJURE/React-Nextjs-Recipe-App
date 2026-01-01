import { NextRequest, NextResponse } from "next/server";
import processEmail from "@/lib/nodemailer/nodemailer";
import { userInbox } from "@/lib/validations/user-choices";




export async function POST(request: NextRequest) {
  const body = await request.json();
  const userInboxValidation = userInbox.safeParse(body);






  if (!userInboxValidation.success) {
    return NextResponse.json({
      success: false,
      error: userInboxValidation.error.issues
    });
  }

  const { menuContent } = userInboxValidation.data;

  await processEmail(menuContent);

  return NextResponse.json({
    success: true,
  });
}
