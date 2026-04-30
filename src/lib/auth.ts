import { betterAuth } from 'better-auth'
import  sendEmail from '@/lib/sendEmail/sendEmail'
import db from '@/lib/db'



export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async({user, url}) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
   
      })
    },
    onPasswordReset: async({user}) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: (profile) => {
        return {
          name: profile.name || `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          emailVerified: profile.email_verified,
          image: profile.picture,
        };
      },
    },
  },

  trustedOrigins: ['http://localhost:3000'],
})
