import nodemailer from "nodemailer";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type sendEmailType = {
  to: string;
  subject: string;
  text: string;
};

export default async function sendEmail({ to, subject, text }: sendEmailType) {
  const transporter = nodemailer.createTransport({
    service: process.env.service,
    auth: {
      user: process.env.from,
      pass: process.env.third_party_app_password,
    },
  });

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    console.log("Oops something has gone wrong");
  }

  const userEmail = session?.user.email;

  console.log("userEmail", userEmail);

  transporter.sendMail({
    from: process.env.from,
    to: to,
    subject: subject,
    text: text,
  });
}
