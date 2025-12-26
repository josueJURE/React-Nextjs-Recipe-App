import nodemailer from 'nodemailer';

export default async function processEmail(recipe: string) {
    const transporter = nodemailer.createTransport({
        service: process.env.service,
        auth: {
          user: process.env.from,
          pass: process.env.third_party_app_password,
        },
      });
   
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
        </body>
      </html>
    `;
    
    transporter.sendMail({
        from: process.env.from,
        to: "josue.jure@gmail.com",
        subject: "Your recipe",
        html: emailDocument,
      
      });

}