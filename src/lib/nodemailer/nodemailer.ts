import nodemailer from "nodemailer";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function processEmail(recipe: string, url?: string) {
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

  const emailDocument = `
      <html>
        <head>
          <style>
            .preserve-line-breaks {
              white-space: pre-line
            }
            .user-img {
              width: 200px;
              height: 200px;
            }
          </style>
        </head>
        <body class="preserve-line-breaks" >
          ${recipe}
          <br />
             <img class="user-img" src="${url}"/>
        </body>
      </html>
    `;

  transporter.sendMail({
    from: process.env.from,
    to: String(userEmail),
    // to: "josue.jure@gmail.com",
    subject: "Your recipe",
    html: emailDocument,
  
  });
}
